import { TUser } from "@pondfm/app-shared";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

import { createHandler } from "@pondfm/server-utils";
import { updateUserSchema } from "../../../../schemas/update-user-schema";
import z from "zod";
import { TAuthenticatedRequest } from "../../../../types/request";

export const updateUserHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof updateUserSchema>>, res) => {
    const session = req.session;
    const { urls, ...payload } = req.body;
    await db.transaction(async (trx) => {
      await db(tablenames.users)
        .where({ id: session.user.id } as TUser)
        .update(payload);
      if (urls && urls.length) {
        await trx(tablenames.userUrls)
          .where({ user_id: session.user.id })
          .del();
        await trx(tablenames.userUrls).insert(
          urls.map((url) => ({ user_id: session.user.id, url })),
        );
      }
    });

    return res.end();
  },
);
