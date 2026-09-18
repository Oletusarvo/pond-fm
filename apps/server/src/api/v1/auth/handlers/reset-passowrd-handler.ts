import { createHandler, verifyJWT } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { tablenames } from "../../../../tablenames";
import { db } from "../../../../db-config";
import { hashPassword } from "../../../../utils/password";
import { TPasswordResetSession } from "../../../../types/password-reset-session";
import { resetPasswordCredentialsSchema } from "../../../../schemas/reset-passowrd-credentials-schema";
import z from "zod";

/**Resets a user's password.
 * @unused This handler is planned for later.
 */
export const resetPasswordHandler = createHandler(
  async (req: TRequest<z.infer<typeof resetPasswordCredentialsSchema>>, res) => {
    const { token, password } = req.body;
    const sessionPayload = verifyJWT(token) as { session_id: Pick<TPasswordResetSession, "id"> };
    if (!sessionPayload?.session_id) {
      return res.status(400).json({
        error: "auth:session-id-missing",
      });
    }
    const session = await db(tablenames.passwordResetSessions)
      .where({ id: sessionPayload.session_id })
      .first();
    if (!session) {
      return res.status(404).json({
        error: "auth:session-missing",
      });
    }
    const now = Date.now();
    const expiry = new Date(session.expires_at);
    if (expiry.getTime() < now) {
      return res.status(401).json({
        error: "auth:session-expired",
      });
    }
    const rowsAffected = await db(tablenames.users)
      .where({ id: session.user_id })
      .update({
        password: await hashPassword(password),
      });
    const status = rowsAffected > 0 ? 200 : 204;
    return res.status(status).end();
  },
);
