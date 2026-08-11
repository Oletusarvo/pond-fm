import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createAuthToken(ctx: DBContext, config: {
  code: string; userId: string; expiresAt: Date;
}) {
  await ctx(tablenames.authTokens)
    .insert({
      code: config.code,
      user_id: config.userId,
      expires_at: config.expiresAt,
      is_used: false,
    })
    .onConflict(['user_id'])
    .merge();
}