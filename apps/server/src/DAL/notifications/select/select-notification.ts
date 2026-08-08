import { Knex } from "knex";

export function selectNotification(query: Knex.QueryBuilder) {
  query.select(
    'notifications.id',
    'notifications.type',
    'notifications.created_at',
    'notifications.seen_at',
  );
}