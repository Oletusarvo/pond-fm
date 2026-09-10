import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { TCursor } from "../../types/cursor";
import { DBContext } from "../../types/db-context";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";

/**Returns the followers of a user. */
export async function getFollowersOf(
  ctx: DBContext,
  config: { ofUserId: string; cursor?: TCursor },
) {
  const query = ctx({ followers: tablenames.followers })
    .join({ user: tablenames.users }, "user.id", "followers.follower_id")
    .where({ followee_id: config.ofUserId })
    .select("user.id", "user.username");
  applyCursor(query, {
    cursor: config.cursor,
    dir: "desc",
    idColumn: "user.id",
    timestampColumn: "user.created_at",
  });
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
