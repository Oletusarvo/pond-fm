import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function deleteFollow(ctx: DBContext, config: { followeeId: string; followerId: string }) {
  await ctx(tablenames.followers).where({
    follower_id: config.followerId,
    followee_id: config.followeeId,
  }).del();
}