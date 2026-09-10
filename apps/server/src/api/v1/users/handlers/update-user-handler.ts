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
    const payload = req.body;
    await db(tablenames.users)
      .where({ id: session.user.id } as TUser)
      .update(payload);
    return res.end();
  },
);
