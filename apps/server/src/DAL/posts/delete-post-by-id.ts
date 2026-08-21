import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
/**@deprecated */
export async function deletePostById(ctx: DBContext, config: { id: string }) {
  await ctx(tablenames.posts).where({ id: config.id }).del();
}