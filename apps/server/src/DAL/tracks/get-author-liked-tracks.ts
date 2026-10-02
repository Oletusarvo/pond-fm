import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getTrackQuery } from "./get-track-query";

export async function getAuthorLikedTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { author_id: string },
) {
  const query = getTrackQuery(ctx, config);
  query
    .join({ likes: tablenames.likes }, "likes.track_id", "track.id")
    .where({ "likes.user_id": config.author_id })
    .orderBy(db.raw("likes.created_at, post_id"), "desc");
  applyCursor(query, {
    dir: "asc",
    timestampColumn: "likes.created_at",
    idColumn: "post_id",
    cursor: config.cursor,
  });
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
