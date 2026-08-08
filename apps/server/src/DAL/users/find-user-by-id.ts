import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectUnseenNotificationCount } from "./select/select-notification-count";
import { selectUser } from "./select/select-user";
import { withFollowerCount } from "./with/with-follower-count";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

export async function findUserById(ctx: DBContext, config: { user: { id: string } }) {
  const query = getUserQuery(ctx);
  withFollowerCount(query);
  withUnseenNotificationCount(query);
  selectUser(query);
  selectUnseenNotificationCount(query);
  return await query.where({ 'users.id': config.user.id }).first();
}