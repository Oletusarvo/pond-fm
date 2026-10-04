import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { fromDistinctTrack } from "./from/from-distinct-track";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";

export async function getTracksByFollowedAuthors(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromDistinctTrack(query);
  const timestampColumn = "track.created_at";
  query
    .join({ followed: tablenames.followers }, "followed.followee_id", "track.author_id")
    .where({ "followed.follower_id": config.session.user.id })
    .orderByRaw("? DESC, post_id DESC", [timestampColumn]);

  applyTrackCursor(query, config.cursor, { dir: "desc", timestampColumn });

  return await resolveQueryWithCursor(query, { pageSize: 10, idColumn: "post_id" });
}
