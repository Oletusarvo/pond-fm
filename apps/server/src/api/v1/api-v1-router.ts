import { getRouter } from "@pondfm/server-utils";
import { decodeSessionCookie } from "../middleware/decode-session-cookie";
import { includeSessionCookie } from "../middleware/include-session-cookie";
import { authRouter } from "./auth/auth-router";
import { billingRouter } from "./billing/billing-router";
import { tagsRouter } from "./tags/tags-router";
import { tracksRouter } from "./tracks/tracks-router";
import { uploadRouter } from "./upload/upload-router";
import { usersRouter } from "./users/users-router";

const router = getRouter();
router.use(includeSessionCookie, decodeSessionCookie);
router.use("/auth", authRouter);
router.use("/tracks", tracksRouter);
router.use("/users", usersRouter);
router.use("/tags", tagsRouter);
router.use("/upload", uploadRouter);
router.use("/billing", billingRouter);

export { router as apiV1Router };
