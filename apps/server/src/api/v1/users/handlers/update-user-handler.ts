import { TUser } from "@pondfm/app-shared";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

import { createHandler } from "@pondfm/server-utils";
import { updateUserSchema } from "../../../../schemas/update-user-schema";
import z from "zod";
import { TAuthenticatedRequest } from "../../../../types/request";
import { services } from "../../../../container";

export const updateUserHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof updateUserSchema>>, res) => {
    const session = req.session;
    const { urls, email, ...payload } = req.body;
    await db.transaction(async (trx) => {
      await db(tablenames.users)
        .where({ id: session.user.id } as TUser)
        .update(payload);
      if (urls && urls.length) {
        await trx(tablenames.userUrls).where({ user_id: session.user.id }).del();
        await trx(tablenames.userUrls).insert(
          urls.map((url) => ({ user_id: session.user.id, url })),
        );
      }

      if (email) {
        //Create an email update session, which resolves once the user clicks a link in an email.
        const expires_at = new Date(Date.now() + 1000 * 60 * 10);
        const [updateSession] = await trx(tablenames.emailUpdateSessions)
          .insert({
            new_email: email,
            user_id: session.user.id,
            expires_at,
            is_used: false,
          })
          .onConflict(["user_id"])
          .merge()
          .returning("id");
        await services.emails.sendEmailResetLink(email, updateSession.id);
      }
    });

    return res.end();
  },
);
