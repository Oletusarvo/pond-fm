import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { TCursor } from "../../types/cursor";
import { DBContext } from "../../types/db-context";
import { TSession } from "../../types/session";
import { fromUndistinctPost } from "./from/from-undistinct-post";
import { getDistinctPostQuery } from "./get-distinct-post-query";
import { getPostQuery } from "./get-post-query";
import { getUndistinctPostQuery } from "./get-undistinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { applyCursor } from "./utils/apply-cursor";
import { filterByGenres } from "./utils/filter-by-genres";
import { filterByMoods } from "./utils/filter-by-moods";
import { onlyCanonicalPosts } from "./utils/only-canonical-posts";
import { onlyReadyUploads } from "./utils/only-ready-uploads";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";
import { withAuthor } from "./with/with-author";
import { withTrack } from "./with/with-track";

export async function getFollowedPosts(ctx: DBContext, config: {
  session: TSession,
  cursor?: TCursor,
  moods?: string[];
  genres?: string[]
}) {
  const query = getUndistinctPostQuery(ctx);
  fromUndistinctPost(query);
  onlyCanonicalPosts(query);
  filterByMoods(query, config.moods);
  filterByGenres(query, config.genres);
  query.whereIn(
    'track.author_id',
    db.select('followee_id').from(tablenames.followers).where({ follower_id: config.session.user.id })
  );
  selectPost(query, config.session);
  selectTrack(query);
  applyCursor(query, {
    dir: 'desc',
    cursor: config.cursor,
    idColumn: 'post.id',
    timestampColumn: 'post.created_at'
  });
  query.orderBy('post.created_at', 'desc');
  return await resolveQueryWithCursor(query, { pageSize: 10 });

}