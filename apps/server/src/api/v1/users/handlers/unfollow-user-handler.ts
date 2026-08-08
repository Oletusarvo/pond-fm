import { deleteFollow } from "../../../../DAL/users/delete-follow";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const unfollowUserHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await deleteFollow(db, { followerId: session.user.id, followeeId: req.params.userId as string });
    return res.end();
  }
)