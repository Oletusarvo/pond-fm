import { TUser } from "@pondfm/app-shared";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { updateUserSchema } from "../../../../schemas/update-user-schema";
import z from "zod";

export const updateUserHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const payload = req.body as z.infer<typeof updateUserSchema>;
    await db(tablenames.users)
      .where({ id: session.user.id } as TUser)
      .update(payload);
    return res.end();
  },
);
