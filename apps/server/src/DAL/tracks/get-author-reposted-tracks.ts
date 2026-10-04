import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";

export async function getAuthorRepostedTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { author_id: string },
) {
  const query = getTrackQuery(ctx, config);
  fromUndistinctTrack(query);
  query
    .where({ is_canonical: false, author_id: config.author_id })
    .orderByRaw("created_at DESC, post_id DESC");
  applyTrackCursor(query, config.cursor, { dir: "desc" });
  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
