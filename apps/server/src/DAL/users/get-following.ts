import { tablenames } from "../../tablenames";
import { TCursor } from "../../types/cursor";
import { DBContext } from "../../types/db-context";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";

/**Returns the users another is following. */
export async function getFollowedBy(
  ctx: DBContext,
  config: { byUserId: string; cursor?: TCursor },
) {
  const query = ctx({ followers: tablenames.followers })
    //Join users matching ids of users being followed (followee_id)
    .join({ user: tablenames.users }, "user.id", "followers.followee_id")
    .where({ follower_id: config.byUserId })
    .select("user.id", "user.username");
  applyCursor(query, {
    cursor: config.cursor,
    dir: "desc",
    idColumn: "user.id",
    timestampColumn: "user.created_at",
  });
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
