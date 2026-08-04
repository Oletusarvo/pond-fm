import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function withUnseenNotificationCount(query: Knex.QueryBuilder) {
  query.with('unseen_notification_count', qb => {
    qb.select('recipient_id')
      .from({ user: tablenames.users })
      .leftJoin(
        { notifications: tablenames.notifications },
        'notifications.recipient_id',
        'user.id',
      )
      .count('notifications.* as notification_count')
      .where({
        seen_at: null,
      })
      .groupBy('notifications.recipient_id');
  });
}