import { getFollowersOf } from "../../../../DAL/users/get-followers";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";

export const getUserFollowers = createHandler(
  async (req, res) => {
    const followers = await getFollowersOf(db, { ofUserId: req.params.userId as string });
    return res.json(followers);
  }
)