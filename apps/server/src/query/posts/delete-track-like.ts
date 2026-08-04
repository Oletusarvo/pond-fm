import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TrackAndUserId } from "../../types/track-type";

export async function deleteTrackLike(ctx: DBContext, config: TrackAndUserId) {
  await ctx(tablenames.likes).where(config).del();
}