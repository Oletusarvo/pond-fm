import { TPost, TPostPublic } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getDistinctPostQuery } from "./get-distinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { FeedQueryConfig } from "./types/feed-config";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "../tracks/filter/filter-by-genres";
import { filterByMoods } from "../tracks/filter/filter-by-moods";
import { onlyReadyUploads } from "../tracks/filter/only-ready-tracks";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getNewPosts(ctx: DBContext, config: FeedQueryConfig) {
  const query = getDistinctPostQuery(ctx, config.session);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
  onlyReadyUploads(query);
  applyCursor(query, {
    cursor: config.cursor,
    dir: "desc",
    timestampColumn: "post.created_at",
    idColumn: "post.id",
  });
  selectPost(query);
  selectTrack(query);
  query.orderBy("post.created_at", "desc");
  return (await resolveQueryWithCursor(query, { pageSize: 10 })) as {
    cursor: string;
    items: TPostPublic[];
  };
}
