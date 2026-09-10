import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectUnseenNotificationCount } from "./select/select-notification-count";
import { selectUser } from "./select/select-user";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

/**Finds a user by id.
 * @deprecated
 */
export async function findUserById(
  ctx: DBContext,
  config: { user: { id: string } },
) {
  const query = getUserQuery(ctx);
  withUnseenNotificationCount(query);
  query.leftJoin(
    "unseen_notification_count",
    "unseen_notification_count.recipient_id",
    "users.id",
  );
  //withFollowerCount(query);

  selectUser(query);
  selectUnseenNotificationCount(query);
  query.select("subscription.json AS subscription");

  return await query.where({ "user.id": config.user.id }).first();
}
