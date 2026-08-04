import { DBContext } from "../../types/db-context";

export async function createPost(ctx: DBContext, config: { post: { track_id: string; user_id: string } }) {
  await ctx('post_data').insert(config.post);
}