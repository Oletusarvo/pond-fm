import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createTrackLike(ctx: DBContext, config: { trackId: string; userId: string }) {
  await ctx(tablenames.likes).insert({
    track_id: config.trackId,
    user_id: config.userId
  });
}