import { Knex } from "knex";

export function onlyCanonicalPosts(query: Knex.QueryBuilder) {
  query.where(function () { this.whereRaw("post.user_id = track.user_id") });
}