import { Knex } from "knex";

export function onlyCanonicalPosts(query: Knex.QueryBuilder) {
  query.where(function () { this.whereRaw("post.author_id = track.author_id") });
}