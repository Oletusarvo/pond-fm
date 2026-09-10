import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

/**Adds a new follow-record. */
export async function createFollow(
  ctx: DBContext,
  config: { followerId: string; followeeId: string },
) {
  await ctx(tablenames.followers).insert({
    follower_id: config.followerId,
    followee_id: config.followeeId,
  });
}
