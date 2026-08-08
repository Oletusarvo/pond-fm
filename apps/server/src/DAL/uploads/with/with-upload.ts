import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function withUpload(query: Knex.QueryBuilder) {
  query.with('upload', qb => {
    qb.select('*').from({ upload: tablenames.uploads });
  })
}