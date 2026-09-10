import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

/**Deletes an authorization token by id. */
export async function deleteAuthTokenById(
  ctx: DBContext,
  config: { id: string },
) {
  await ctx(tablenames.authTokens).where({ id: config.id }).del();
}
