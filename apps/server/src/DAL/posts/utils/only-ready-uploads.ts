import { Knex } from "knex";

export function onlyReadyUploads(query: Knex.QueryBuilder) {
  query.where({ 'track.status': 'active' });
}