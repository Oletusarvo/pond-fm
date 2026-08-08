import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function withUnseenNotificationCount(query: Knex.QueryBuilder) {
  query.with('unseen_notification_count', qb => {
    qb
      .from({ user: tablenames.users })
      .leftJoin(
        { notifications: tablenames.notifications },
        'notifications.recipient_id',
        'user.id',
      )
      .select('recipient_id')
      .count('notifications.* as count')
      .where({
        seen_at: null,
      })
      .groupBy('notifications.recipient_id');
  });
}