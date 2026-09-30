import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { filterByGenres } from "./filter/filter-by-genres";
import { filterByMoods } from "./filter/filter-by-moods";
import { onlyCanonicalTracks } from "./filter/only-canonical-tracks";
import { onlyReadyUploads } from "./filter/only-ready-tracks";
import { getUndiscoveredTrackQuery } from "./get-undiscovered-track-query";
import { selectLikedByMe } from "./select/select-liked-by-me";
import { selectRepostedByMe } from "./select/select-reposted-by-me";

export async function getUndiscoveredTracks(ctx: DBContext, config: FeedQueryConfig) {
  const query = ctx({ track: viewnames.tracks })
    .where({ is_discovered: false, is_canonical: true })
    .select("track.*");

  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);

  applyCursor(query, {
    dir: "asc",
    timestampColumn: "created_at",
    idColumn: "track.post_id",
    cursor: config.cursor,
  });

  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
