
import { DBContext } from "../../types/db-context";
import { getUndistinctPostQuery } from "./get-undistinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { FeedQueryConfig } from "./types/feed-config";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "./utils/filter-by-genres";
import { filterByMoods } from "./utils/filter-by-moods";
import { onlyCanonicalPosts } from "./utils/only-canonical-posts";
import { onlyReadyUploads } from "./utils/only-ready-uploads";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getUndiscoveredPosts(ctx: DBContext, config: FeedQueryConfig) {
  const query = getUndistinctPostQuery(ctx);
  onlyCanonicalPosts(query);
  onlyReadyUploads(query);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  query.where('track.unique_play_count', '<', 100)
    .orderBy('post.created_at', 'asc');
  applyCursor(query, {
    ...config,
    dir: 'asc',
    timestampColumn: 'post.created_at',
    idColumn: 'post.id'
  });
  selectPost(query, config.session);
  selectTrack(query);

  return await resolveQueryWithCursor(query, { pageSize: 10 });
}