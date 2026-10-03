import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
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
  query
    .join({ likes: tablenames.likes }, "likes.track_id", "track.id")
    .where({ "likes.user_id": config.author_id, is_canonical: true })
    .orderByRaw("likes.created_at DESC, post_id DESC");

  applyCursor(query, {
    dir: "asc",
    timestampColumn: "likes.created_at",
    idColumn: "post_id",
    cursor: config.cursor,
  });
  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
