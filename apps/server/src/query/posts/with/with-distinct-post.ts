import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function withDistinctPost(query: Knex.QueryBuilder) {
  query.with('post_distinct', qb => {
    qb.select('*')
      .distinctOn('track_id')
      .from(tablenames.posts)
      .orderBy(db.raw('track_id, created_at'), 'desc');
  })
}