import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { apiRouter } from "./api/api-router";

import { tablenames, viewnames } from "./tablenames";
import { db } from "./db-config";
import { signCommand } from "@pondfm/crypto";
import { retry } from "@pondfm/server-utils";
import { withTrack } from "./DAL/posts/with/with-track";
import { stripeWebhookHandler } from "./api/v1/billing/webhooks/stripe/stripe-webhook-handler";
import { verifyStripeSignature } from "./api/v1/billing/middleware/verify-stripe-signature";
import { fileDeleter } from "./features/file-deleter/file-deleter";

require("dotenv").config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://pond-fm.onrender.com",
];
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin || true);
      } else {
        console.log("Disallowed origin", origin);
        return callback(new Error(`Origin ${origin} blocked by CORS!`));
      }
    },
    methods: ["GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.post(
  "/api/v1/billing/webhook/stripe",
  express.raw({ type: "application/json" }),
  verifyStripeSignature,
  stripeWebhookHandler,
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", apiRouter);

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
runCleanup().finally(() => {
  server.listen(PORT, () => {
    console.log("Server listening on port ", PORT);
    setInterval(runCleanup, 1000 * 60 * 60 * 12);
  });
});

async function runCleanup() {
  console.log("Running cleanup...");
  await retry(async () =>
    db(tablenames.users)
      .where({ status: "pending_verification" })
      .whereRaw("CURRENT_TIMESTAMP - created_at >= INTERVAL '24h'")
      .del(),
  ).catch((err) => {
    console.log("Failed to delete expired pending users.", err.stack);
  });

  await cleanupUnusedFilesAndTracks().catch((err) =>
    console.log("Failed to delete unused files!", err.stack),
  );
  await retry(
    async () =>
      await db(tablenames.authTokens)
        .where("expires_at", "<=", db.fn.now())
        .del(),
  ).catch((err) =>
    console.log("Failed to delete expired auth tokens.", err.stack),
  );

  await retry(
    async () =>
      await db(tablenames.uploadTokens)
        .where("expires_at", "<=", db.fn.now())
        .del(),
  ).catch((err) =>
    console.log("Failed to delete expired upload tokens.", err.stack),
  );
}

async function cleanupUnusedFilesAndTracks() {
  const foldersToDelete = (await db({ folder: tablenames.uploadFolders })
    .where(function () {
      this.where({ status: "pending_upload" })
        .orWhere({ status: "failed_upload" })
        .orWhere({ status: "processing_audio" })
        .andWhereRaw("CURRENT_TIMESTAMP - updated_at >= INTERVAL '15min'");
    })
    .orWhere({ status: "deleted" })
    .select(
      "id",
      db.raw(
        "(SELECT JSON_AGG(key) FROM upload.upload_data WHERE upload_folder_id = folder.id) AS keys",
      ),
    )) as { id: string; keys: string[] }[];

  if (foldersToDelete.length == 0) {
    console.log("Nothing to delete");
    return;
  }

  const keys = foldersToDelete.flatMap((f) => f.keys);
  const result = await fileDeleter.del(keys);
  if (result.success) {
    await retry(
      async () =>
        await db(tablenames.uploadFolders)
          .whereIn(
            "id",
            foldersToDelete.map((f) => f.id),
          )
          .del(),
      {
        retries: 5,
      },
    );
  }
}
