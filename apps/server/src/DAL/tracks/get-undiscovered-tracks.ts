import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";

export async function getUndiscoveredTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromUndistinctTrack(query);
  query
    .where({ is_canonical: true, is_discovered: false })
    .orderByRaw("created_at ASC, post_id ASC");

  applyCursor(query, {
    dir: "asc",
    timestampColumn: "created_at",
    idColumn: "track.post_id",
    cursor: config.cursor,
  });

  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
