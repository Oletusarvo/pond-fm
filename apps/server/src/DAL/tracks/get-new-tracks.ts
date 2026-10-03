import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromDistinctTrack } from "./from/from-distinct-track";
import { getTrackQuery } from "./get-track-query";

export async function getNewTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromDistinctTrack(query);
  query.orderByRaw("created_at DESC, post_id DESC");
  applyCursor(query, {
    dir: "desc",
    timestampColumn: "created_at",
    idColumn: "post_id",
    cursor: config.cursor,
  });
  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
