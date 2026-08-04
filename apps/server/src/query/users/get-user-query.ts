import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { fromUsers } from "./from/from-users";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

export function getUserQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  fromUsers(query);
  withUnseenNotificationCount(query);
  query.join({ user_status: tablenames.userStatuses }, 'users.user_status_id', 'user_status.id')
    .leftJoin(
      { notifications_count: 'unseen_notification_count' },
      'notifications_count.recipient_id',
      'users.id',
    );
  return query;
}