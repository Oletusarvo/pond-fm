import { TPost, TPostPublic } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getUndistinctPostQuery } from "./get-undistinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { FeedQueryConfig } from "./types/feed-config";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "../tracks/filter/filter-by-genres";
import { filterByMoods } from "../tracks/filter/filter-by-moods";
import { onlyCanonicalTracks } from "../tracks/filter/only-canonical-tracks";
import { onlyReadyUploads } from "../tracks/filter/only-ready-tracks";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getUndiscoveredPosts(ctx: DBContext, config: FeedQueryConfig) {
  const query = getUndistinctPostQuery(ctx, config.session);
  onlyCanonicalTracks(query);
  onlyReadyUploads(query);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  query
    .where(
      "track.unique_play_count",
      "<",
      db
        .select("unique_listeners_threshold")
        .from({ subscription: viewnames.subscriptions })
        .whereRaw("subscription.user_id = track.author_id")
        .limit(1),
    )
    .orderBy("post.created_at", "asc");
  applyCursor(query, {
    ...config,
    dir: "asc",
    timestampColumn: "post.created_at",
    idColumn: "post.id",
  });
  selectPost(query);
  selectTrack(query);

  return (await resolveQueryWithCursor(query, { pageSize: 10 })) as {
    cursor: string;
    items: TPostPublic[];
  };
}
