import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

/**Creates a new post. */
export async function createPost(ctx: DBContext, config: { post: { trackId: string; authorId: string } }) {
  const [post] = await ctx(tablenames.posts).insert({
    track_id: config.post.trackId, author_id: config.post.authorId
  }).returning('*');
  return post;
}