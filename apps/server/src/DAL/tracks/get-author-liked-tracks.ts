import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromDistinctTrack } from "./from/from-distinct-track";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";

/**Gets all tracks liked by a specific user. */
export async function getAuthorLikedTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { author_id: string },
) {
  const query = getTrackQuery(ctx, config);
  fromUndistinctTrack(query);
  const timestampColumn = "likes.created_at";
  query
    .join({ likes: tablenames.likes }, "likes.track_id", "track.id")
    .where({ "likes.user_id": config.author_id, is_canonical: true })
    .orderByRaw("? DESC, post_id DESC", [timestampColumn]);
  applyTrackCursor(query, config.cursor, { dir: "desc", timestampColumn });

  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
