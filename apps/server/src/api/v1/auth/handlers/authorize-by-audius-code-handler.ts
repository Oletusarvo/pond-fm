import { createHandler } from "@pondfm/server-utils";
import z from "zod";
import { TRequest } from "../../../../types/request";
import { authorizeByAudiusSchema } from "../../../../schemas/authorize-by-audius-schema";
import crypto from "crypto";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

export const authorizeByAudiusCodeHandler = createHandler(async (req: TRequest, res) => {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("SHA256").update(verifier).digest().toString("base64url");
  const state = crypto.randomBytes(32).toString("base64url");
  await db(tablenames.loginSessions)
    .insert({
      verifier,
      challenge,
      state,
      is_used: false,
      expires_at: new Date(Date.now() + 1000 * 60 * 5),
    })
    .onConflict(["state"])
    .merge();

  return res.redirect(
    `https://api.audius.co/v1/oauth/authorize` +
      `?api_key=${process.env.AUDIUS_API_KEY}` +
      `&scope=read` +
      `&response_type=code` +
      `&code_challenge_method=S256` +
      `&code_challenge=${challenge}` +
      `&state=${state}` +
      `&redirect_uri=${encodeURIComponent("http://localhost:3002/api/v1/auth/token")}`,
  );
});
