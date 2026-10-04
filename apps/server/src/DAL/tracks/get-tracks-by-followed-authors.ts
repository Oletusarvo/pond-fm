import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyTrackCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { filterByGenres } from "./filter/filter-by-genres";
import { filterByMoods } from "./filter/filter-by-moods";
import { selectLikedByMe } from "./select/select-liked-by-me";
import { selectRepostedByMe } from "./select/select-reposted-by-me";
import { withDistinctTrack } from "./with/with-distinct-track";

export async function getTracksByFollowedAuthors(ctx: DBContext, config: FeedQueryConfig) {
  const query = ctx.queryBuilder();
  const session = config.session;

  withDistinctTrack(query);

  query
    .with("followed_track", (qb) => {
      qb.select("t.*")
        .from({ t: "distinct_track" })
        .join({ f: tablenames.followers }, "f.followee_id", "t.author_id")
        .where({ "f.follower_id": config.session?.user.id });
    })
    .from({ track: "followed_track" })
    .select("track.*")
    .orderByRaw("created_at DESC, post_id DESC");

  selectRepostedByMe(query, session);
  selectLikedByMe(query, session);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  applyTrackCursor(query, config.cursor, { dir: "desc" });

  return await resolveQueryWithCursor(query, {
    pageSize: 10,
    idColumn: "post_id",
  });
}
