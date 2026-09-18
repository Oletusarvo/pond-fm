import { checkAuth } from "../../middleware/check-auth";
import { authorizeByCodeHandler } from "./handlers/authorize-by-code-handler";
import { requestAuthorizationHandler } from "./handlers/request-authorization-handler";
import { getSessionInfoHandler } from "./handlers/get-session-info-handler";
import { logoutHandler } from "./handlers/logout-handler";
import { emailPayloadSchema } from "../../../schemas/email-payload-schema";
import { authorizeByCodeSchema } from "../../../schemas/authorize-by-code-schema";
import { refreshSessionHandler } from "./handlers/refresh-session-handler";
import { createBodyParser, getRouter } from "@pondfm/server-utils";
import { signupHandler } from "./handlers/signup-handler";
import { verifyEmailHandler } from "./handlers/verify-email-handler";
import { signupSchema } from "../../../schemas/signup-schema";
import { verifyEmailSchema } from "../../../schemas/verify-email-schema";

const router = getRouter();

/**
 * POST /auth/request-authorization
 * @summary Sends a login magic link to a users email.
 * @tags Auth
 */
router.post(
  "/request-authorization",
  createBodyParser(emailPayloadSchema),
  requestAuthorizationHandler,
);
/**
 * POST /auth/authorize
 * @summary Authorizes access for a user by a code.
 * @tags Auth
 */
router.post("/authorize", createBodyParser(authorizeByCodeSchema), authorizeByCodeHandler);
router.post("/signup", createBodyParser(signupSchema), signupHandler);
router.post("/verify", createBodyParser(verifyEmailSchema), verifyEmailHandler);
/**
 * POST /auth/logout
 * @summary Logs a user out.
 * @tags Auth
 */
router.post("/logout", checkAuth(), logoutHandler);
/**
 * GET /auth/me
 * @summary Returns the session information of the currently authenticated user.
 * @tags Auth
 */
router.get("/me", checkAuth(), getSessionInfoHandler);
/**
 * POST /auth/me/refresh
 * @summary Updates the currently authenticated users session.
 * @tags Auth
 */
router.post("/me/refresh", checkAuth(), refreshSessionHandler);
export { router as authRouter };
