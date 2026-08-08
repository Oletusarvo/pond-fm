import { Knex } from "knex";

export function selectSender(query: Knex.QueryBuilder) {
  query.select('sender.json AS sender');
}