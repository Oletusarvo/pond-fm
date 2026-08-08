import { Knex } from "knex";

export function onlyReadyUploads(query: Knex.QueryBuilder) {
  query.where({ 'upload.status': 'ready' });
}