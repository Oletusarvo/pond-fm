import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor, applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { filterByGenres } from "./filter/filter-by-genres";
import { filterByMoods } from "./filter/filter-by-moods";
import { onlyReadyTracks } from "./filter/only-ready-tracks";
import { fromDistinctTrack } from "./from/from-distinct-track";
import { fromUndistinctTrack } from "./from/from-undistinct-track";
import { getTrackQuery } from "./get-track-query";
import { selectLikedByMe } from "./select/select-liked-by-me";
import { selectRepostedByMe } from "./select/select-reposted-by-me";
import { withUndistinctTrack } from "./with/with-undistinct-track";

/**Gets all tracks liked by a specific user. */
export async function getAuthorLikedTracks(
  ctx: DBContext,
  config: FeedQueryConfig & { author_id: string },
) {
  const query = ctx.queryBuilder();
  withUndistinctTrack(query);
  onlyReadyTracks(query);
  query
    .with("liked_track", (qb) => {
      qb.select("t.*")
        .from({ t: "undistinct_track" })
        .join({ likes: tablenames.likes }, "likes.track_id", "t.id")
        .where({ "likes.user_id": config.author_id, is_canonical: true });
    })
    .from({ track: "liked_track" })
    .select("track.*")
    .orderByRaw("created_at DESC, post_id DESC");
  const session = config.session;
  selectRepostedByMe(query, session);
  selectLikedByMe(query, session);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  applyTrackCursor(query, config.cursor, { dir: "desc" });
  applyTrackCursor(query, config.cursor, { dir: "desc" });

  return await resolveQueryWithCursor(query, {
    pageSize: 10,
    idColumn: "post_id",
  });
}
