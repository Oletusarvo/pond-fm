import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { updateUserSchema } from "../../../../schemas/update-user-schema";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

/**Updates the currently authenticated user. */
export const updateUserHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof updateUserSchema>>, res) => {
    const { urls } = req.body;
    const session = req.session;
    await db.transaction(async (trx) => {
      await trx(tablenames.userUrls).where({ user_id: session.user.id }).del();
      await trx(tablenames.userUrls).insert(
        urls.map((url) => {
          return {
            url: url,
            user_id: session.user.id,
          };
        }),
      );
      return res.end();
    });
  },
);
