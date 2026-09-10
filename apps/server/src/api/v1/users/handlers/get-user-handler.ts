import { getPublicUser } from "../../../../DAL/users/get-public-user";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns the public data of a user. */
export const getUserHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const { userId } = req.params as { userId: string };
    const user = await getPublicUser(db, { id: userId, session: req.session });
    return res.json(user);
  },
);
