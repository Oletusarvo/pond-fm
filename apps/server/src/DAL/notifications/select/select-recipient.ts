import { Knex } from "knex";

export function selectRecipient(query: Knex.QueryBuilder) {
  query.select('recipient.json AS recipient');
}