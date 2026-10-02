import { db } from "../../db-config";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getTrackQuery } from "./get-track-query";

export async function getAuthorTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { canonical_author_id: string },
) {
  const query = getTrackQuery(ctx, config);
  query
    .where({ is_canonical: true, canonical_author_id: config.canonical_author_id })
    .orderBy(db.raw("created_at, post_id"), "desc");
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
