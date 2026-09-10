import { getDisplayUser } from "../../../../DAL/users/get-display-user";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns the public data of a user. */
export const getUserHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const { userId } = req.params as { userId: string };
    const user = await getDisplayUser(db, { id: userId, session: req.session });
    return res.json(user);
  },
);
