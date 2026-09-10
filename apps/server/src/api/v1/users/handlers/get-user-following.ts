import { getFollowedBy } from "../../../../DAL/users/get-following";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";

/**Returns the users another is following. */
export const getUserFollowing = createHandler(async (req, res) => {
  const following = await getFollowedBy(db, {
    byUserId: req.params.userId as string,
  });
  return res.json(following);
});
