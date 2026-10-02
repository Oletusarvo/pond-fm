import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getTrackQuery } from "./get-track-query";

export async function getTracksByFollowedAuthors(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  query
    .join({ followed: tablenames.followers }, "followed.followee_id", "track.author_id")
    .where({ "followed.follower_id": config.session.user.id })
    .orderByRaw("created_at DESC, post_id DESC");

  applyCursor(query, {
    dir: "desc",
    idColumn: "post_id",
    timestampColumn: "created_at",
    cursor: config.cursor,
  });

  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
