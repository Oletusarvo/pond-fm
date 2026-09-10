import { Knex } from "knex";
import { db } from "../../../db-config";

export function selectUnseenNotificationCount(query: Knex.QueryBuilder) {
  query.select(
    db.raw(
      "COALESCE(unseen_notification_count.count, 0) AS unseen_notification_count",
    ),
  );
}
