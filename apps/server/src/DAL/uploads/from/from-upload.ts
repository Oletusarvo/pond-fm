import { Knex } from "knex";

export function fromUpload(query: Knex.QueryBuilder) {
  query.from({ upload: 'upload' });
}