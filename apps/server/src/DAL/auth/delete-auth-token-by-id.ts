import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function deleteAuthTokenById(ctx: DBContext, config: { id: string }) {
  await ctx(tablenames.authTokens).where({ id: config.id }).del();
}