import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";

export async function getUndiscoveredTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromUndistinctTrack(query);
  query
    .where({ is_canonical: true, is_discovered: false })
    .orderByRaw("created_at ASC, post_id ASC");

  applyTrackCursor(query, config.cursor, { dir: "asc" });

  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
