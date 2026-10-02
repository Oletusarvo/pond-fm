import { audius } from "../../../../audius.config";
import { getFollowersOf } from "../../../../DAL/users/get-followers";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";

/**Returns the followers of a user. */
export const getUserFollowers = createHandler(async (req, res) => {
  const followers = await getFollowersOf(db, {
    ofUserId: req.params.userId as string,
  });

  const userIdSet = new Set<string>(followers.items.map((f) => f.id));
  const users = await audius.users.get(Array.from(userIdSet));
  const userMap = new Map<string, any>(users.map((u) => [u.id, u]));

  return res.json({
    cursor: followers.cursor,
    items: followers.items.map((f) => {
      return {
        id: f.id,
        username: userMap.get(f.id).name,
      };
    }),
  });
});
