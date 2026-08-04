import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function withUndistinctPost(query: Knex.QueryBuilder) {
  query.with('post_undistinct', qb => {
    qb.select('*').from(tablenames.posts).orderBy('created_at', 'asc');
  })
}