import { Knex } from "knex";
import { db } from "../../../db-config";

export function selectNotificationCount(query: Knex.QueryBuilder) {
  query.select(db.raw(
    'COALESCE(notifications_count.notification_count, 0) AS unseen_notification_count',
  ));
}