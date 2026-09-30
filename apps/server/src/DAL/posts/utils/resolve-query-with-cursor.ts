import { Knex } from "knex";
import { FeedBuilder } from "../../../utils/feed-builder";

export async function resolveQueryWithCursor(
  query: Knex.QueryBuilder,
  config: {
    pageSize: number;
  },
) {
  const { pageSize } = config;

  const data = await query.limit(pageSize + 1);
  const fb = new FeedBuilder(pageSize);
  const cursor = fb.withCursor(data);
  return cursor;
}
