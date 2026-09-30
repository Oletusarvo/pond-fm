import { Knex } from "knex";
import { FeedBuilder } from "../../../utils/feed-builder";

export async function resolveQueryWithCursor(
  query: Knex.QueryBuilder,
  config: {
    pageSize: number;
  },
) {
  const { pageSize } = config;
  console.log("Limiting...");
  const data = await query.limit(pageSize + 1);
  console.log("Running fb...");
  const fb = new FeedBuilder(pageSize);
  console.log("Returning with cursor...");
  const cursor = fb.withCursor(data);
  console.log("Returning cursor...", cursor);
  return cursor;
}
