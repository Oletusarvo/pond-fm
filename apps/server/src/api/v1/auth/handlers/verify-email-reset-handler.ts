import { createHandler, verifyJWT } from "@pondfm/server-utils";
import { TAuthenticatedRequest, TRequest } from "../../../../types/request";
import z from "zod";
import { verifyEmailSchema } from "../../../../schemas/verify-email-schema";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

export const verifyEmailResetHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof verifyEmailSchema>>, res) => {
    const { token } = req.body;
    const session = req.session;
    const payload = verifyJWT(token) as { session_id: string };
    const emailUpdateSession = await db(tablenames.emailUpdateSessions)
      .where({ id: payload.session_id, user_id: session.user.id, is_used: false })
      .andWhereRaw("CURRENT_TIMESTAMP < expires_at")
      .first();

    if (!emailUpdateSession) {
      return res.status(404).end();
    }

    await db.transaction(async (trx) => {
      await trx(tablenames.users).where({ id: emailUpdateSession.user_id }).update({
        email: emailUpdateSession.new_email,
        updated_at: db.fn.now(),
      });
      await trx(tablenames.emailUpdateSessions).where({ id: emailUpdateSession.id }).update({
        is_used: true,
      });
    });
    return res.json({
      new_email: emailUpdateSession.new_email,
    });
  },
);
