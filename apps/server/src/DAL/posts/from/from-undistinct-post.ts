import { Knex } from "knex";

export function fromUndistinctPost(query: Knex.QueryBuilder) {
  query.from({ post: 'post_undistinct' });
}