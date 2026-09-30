import { Knex } from "knex";

export function selectUser(query: Knex.QueryBuilder) {
  query.select(
    "users.audius_user_id",
    "users.status",
    "users.urls",
    "users.unseen_notification_count",
  );
}
