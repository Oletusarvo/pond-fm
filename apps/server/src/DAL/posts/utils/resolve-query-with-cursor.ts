import { Knex } from "knex";
import { FeedBuilder } from "../../../utils/feed-builder";

/**Awaits the provided query and returns an object containing the found items and a cursor pointing to the id and timestamp of the last item. */
export async function resolveQueryWithCursor(
  query: Knex.QueryBuilder,
  config: {
    pageSize: number;
    idColumn?: string;
    timestampColumn?: string;
  },
) {
  const { pageSize, idColumn, timestampColumn } = config;

  const data = await query.limit(pageSize + 1);
  const fb = new FeedBuilder(pageSize, idColumn, timestampColumn);
  const cursor = fb.withCursor(data);
  return cursor;
}
