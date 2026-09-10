import { getFollowersOf } from "../../../../DAL/users/get-followers";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";

/**Returns the followers of a user. */
export const getUserFollowers = createHandler(async (req, res) => {
  const followers = await getFollowersOf(db, {
    ofUserId: req.params.userId as string,
  });
  return res.json(followers);
});
