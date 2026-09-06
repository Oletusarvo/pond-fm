import { TPost, TSession } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { TCursor } from "../../types/cursor";
import { DBContext } from "../../types/db-context";

import { fromUndistinctPost } from "./from/from-undistinct-post";
import { getUndistinctPostQuery } from "./get-undistinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "./utils/filter-by-genres";
import { filterByMoods } from "./utils/filter-by-moods";
import { onlyCanonicalPosts } from "./utils/only-canonical-posts";
import { onlyReadyUploads } from "./utils/only-ready-uploads";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getFollowedPosts(ctx: DBContext, config: {
  session: TSession,
  cursor?: TCursor,
  moods?: string[];
  genres?: string[]
}) {
  const query = getUndistinctPostQuery(ctx, config.session);
  fromUndistinctPost(query);
  onlyCanonicalPosts(query);
  onlyReadyUploads(query);
  filterByMoods(query, config.moods);
  filterByGenres(query, config.genres);
  query.whereIn(
    'track.author_id',
    db.select('followee_id').from(tablenames.followers).where({ follower_id: config.session.user.id })
  );
  selectPost(query);
  selectTrack(query);
  applyCursor(query, {
    dir: 'desc',
    cursor: config.cursor,
    idColumn: 'post.id',
    timestampColumn: 'post.created_at'
  });
  query.orderBy('post.created_at', 'desc');
  return await resolveQueryWithCursor(query, { pageSize: 10 }) as {
    cursor: string;
    items: TPost[];
  };
}