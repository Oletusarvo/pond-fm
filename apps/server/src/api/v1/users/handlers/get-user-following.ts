import { getFollowedBy } from "../../../../DAL/users/get-following";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";

export const getUserFollowing = createHandler(
  async (req, res) => {
    const following = await getFollowedBy(db, { byUserId: req.params.userId as string });
    return res.json(following)
  }
)