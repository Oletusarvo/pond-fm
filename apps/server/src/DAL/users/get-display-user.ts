import { DBContext } from "../../types/db-context";
import { TSession } from "../../types/session";
import { getUserQuery } from "./get-user-query";
import { selectFollowedByMe } from "./select/select-followed-by-me";
import { selectUser } from "./select/select-user";
import { withFollowingCount } from "./with/with-followee-count";
import { withFollowerCount } from "./with/with-follower-count";

/**Returns a user for display to others. */
export async function getDisplayUser(ctx: DBContext, config: { id: string; session?: TSession }) {
  const query = getUserQuery(ctx);
  withFollowingCount(query);
  withFollowerCount(query);
  query.join('following_count', 'following_count.user_id', 'users.id');
  query.join('follower_count', 'follower_count.user_id', 'users.id');

  selectUser(query);
  selectFollowedByMe(query, config.session);
  query.select('following_count.count as following_count');
  query.select('follower_count.count as follower_count');
  return await query.where({ 'users.id': config.id }).first();
}