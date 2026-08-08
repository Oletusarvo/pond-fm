import { getDisplayUser } from "../../../../DAL/users/get-display-user";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const getUserHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const { userId } = req.params as { userId: string };
    const user = await getDisplayUser(db, { id: userId, session: req.session });
    return res.json(user);
  }
)