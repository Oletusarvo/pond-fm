import { createHandler, verifyJWT } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import z from "zod";
import { verifyEmailSchema } from "../../../../schemas/verify-email-schema";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { TUser } from "@pondfm/app-shared";

/**Activates a user. */
export const activateUserHandler = createHandler(
  async (req: TRequest<z.infer<typeof verifyEmailSchema>>, res) => {
    const { token } = req.body;

    const payload = verifyJWT(token) as { user_id: string };
    if (!payload || !payload.user_id) {
      return res.status(401).end();
    }

    await db.transaction(async (trx) => {
      const rowsAffected = await trx(tablenames.users)
        .where({
          id: payload.user_id,
          status: "pending_verification",
        } as TUser)
        .update({
          status: "active",
          updated_at: db.fn.now() as unknown as string,
        } as unknown as TUser);
      if (rowsAffected > 0) {
        await trx(tablenames.serviceSettings).increment("registered_users", 1);
      }
    });

    return res.end();
  },
);
