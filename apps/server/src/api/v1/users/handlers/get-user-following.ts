import { audius } from "../../../../audius.config";
import { getFollowedBy } from "../../../../DAL/users/get-following";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";

/**Returns the users another is following. */
export const getUserFollowing = createHandler(async (req, res) => {
  const following = await getFollowedBy(db, {
    byUserId: req.params.userId as string,
  });
  const userIdSet = new Set<string>(following.items.map((f) => f.id));
  const users = await audius.users.get(Array.from(userIdSet));
  const userMap = new Map<string, any>(users.map((u) => [u.id, u]));

  return res.json({
    cursor: following.cursor,
    items: following.items.map((f) => {
      return {
        id: f.id,
        username: userMap.get(f.id).name,
      };
    }),
  });
});
