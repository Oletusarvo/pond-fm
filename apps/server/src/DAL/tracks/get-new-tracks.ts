import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getTrackQuery } from "./get-track-query";
import { selectLikedByMe } from "./select/select-liked-by-me";

export async function getNewTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  applyCursor(query, {
    dir: "desc",
    timestampColumn: "created_at",
    idColumn: "post_id",
    cursor: config.cursor,
  });
  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
