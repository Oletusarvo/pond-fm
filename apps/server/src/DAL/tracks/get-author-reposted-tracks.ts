import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getTrackQuery } from "./get-track-query";

export async function getAuthorRepostedTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { author_id: string },
) {
  const query = getTrackQuery(ctx, config);
  query
    .where({ is_canonical: false, author_id: config.author_id })
    .orderBy(db.raw("created_at, post_id"), "desc");
  applyCursor(query, {
    dir: "desc",
    timestampColumn: "created_at",
    idColumn: "post_id",
    cursor: config.cursor,
  });
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
