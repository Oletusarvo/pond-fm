import { Knex } from "knex";

export function fromDistinctPost(query: Knex.QueryBuilder) {
  query.from({ post: 'post_distinct' });
}