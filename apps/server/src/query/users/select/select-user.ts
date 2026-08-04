import { Knex } from "knex";

export function selectUser(query: Knex.QueryBuilder) {
  query.select(
    'users.id',
    'users.email',
    'users.username',
    'user_status.label as status',
  );
}