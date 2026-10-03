import { db } from "../../db-config";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyCursorRaw } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromDistinctTrack } from "./from/from-distinct-track";

import { getTrackQuery } from "./get-track-query";

export async function getNewTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromDistinctTrack(query);
  const cursor = config.cursor;
  applyCursorRaw(query, cursor, "created_at <= ? AND post_id < ?");
  query.orderByRaw("created_at DESC, post_id DESC");

  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
