import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createFollow(ctx: DBContext, config: { followerId: string; followeeId: string }) {
  await ctx(tablenames.followers).insert({
    follower_id: config.followerId,
    followee_id: config.followeeId,
  });
}