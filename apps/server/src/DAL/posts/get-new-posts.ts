
import { TPost } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getDistinctPostQuery } from "./get-distinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { FeedQueryConfig } from "./types/feed-config";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "./utils/filter-by-genres";
import { filterByMoods } from "./utils/filter-by-moods";
import { onlyReadyUploads } from "./utils/only-ready-uploads";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getNewPosts(ctx: DBContext, config: FeedQueryConfig) {
  const query = getDistinctPostQuery(ctx);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  onlyReadyUploads(query);
  applyCursor(query, {
    cursor: config.cursor,
    dir: 'desc',
    timestampColumn: 'post.created_at',
    idColumn: 'post.id'
  });
  selectPost(query, config.session);
  selectTrack(query);
  query.orderBy('post.created_at', 'desc');
  return await resolveQueryWithCursor(query, { pageSize: 10 }) as {
    cursor: string;
    items: TPost[];
  };
}