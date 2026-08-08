import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createAuthToken(ctx: DBContext, config: {
  code: string; user_id: string; expires_at: Date;
}) {
  await ctx(tablenames.authTokens)
    .insert({
      code: config.code,
      user_id: config.user_id,
      expires_at: config.expires_at,
      is_used: false,
    })
    .onConflict(['user_id'])
    .merge();
}