import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectUnseenNotificationCount } from "./select/select-notification-count";
import { selectUser } from "./select/select-user";
import { withFollowerCount } from "./with/with-follower-count";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

export async function findUserByEmail(ctx: DBContext, config: { email: string }) {
  const query = getUserQuery(ctx);
  withUnseenNotificationCount(query);
  query.leftJoin('unseen_notification_count', 'unseen_notification_count.recipient_id', 'users.id');
  query.join({ subscription: 'subscription' }, 'subscription.user_id', 'users.id');

  selectUser(query);
  selectUnseenNotificationCount(query);
  query.select(
    db.raw("JSON_BUILD_OBJECT('id', subscription.id, 'label', subscription.label) AS subscription")
  );

  return await query.where({ email: config.email }).first();
}