import { Knex } from "knex";
import { FeedBuilder } from "../../../utils/feed-builder";

export async function resolveQueryWithCursor(
  query: Knex.QueryBuilder,
  config: {
    pageSize: number;
    idColumn?: string;
  },
) {
  const { pageSize, idColumn } = config;

  const data = await query.limit(pageSize + 1);
  const fb = new FeedBuilder(pageSize, idColumn);
  const cursor = fb.withCursor(data);
  return cursor;
}
