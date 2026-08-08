
import { DBContext } from "../../types/db-context";
import { getUndistinctPostQuery } from "./get-undistinct-post-query";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";
import { FeedQueryConfig } from "./types/feed-config";
import { applyCursor } from "./utils/apply-cursor";
import { onlyCanonicalPosts } from "./utils/only-canonical-posts";
import { resolveQueryWithCursor } from "./utils/resolve-query-with-cursor";

export async function getAuthorPosts(ctx: DBContext, config: FeedQueryConfig & { authorId: string }) {
  const query = getUndistinctPostQuery(ctx);
  onlyCanonicalPosts(query);
  applyCursor(query, {
    cursor: config.cursor,
    dir: 'desc',
    timestampColumn: 'post.created_at',
    idColumn: 'post.id'
  });
  selectPost(query, config.session);
  selectTrack(query);
  query.where({ 'post.author_id': config.authorId })
  query.orderBy('post.created_at', 'desc');
  return await resolveQueryWithCursor(query, { pageSize: 10 })
}