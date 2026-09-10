import { deleteFollow } from "../../../../DAL/users/delete-follow";
import { db } from "../../../../db-config";

import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Unfollows a user. */
export const unfollowUserHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const session = req.session;
    await deleteFollow(db, {
      followerId: session.user.id,
      followeeId: req.params.userId as string,
    });
    return res.end();
  },
);
