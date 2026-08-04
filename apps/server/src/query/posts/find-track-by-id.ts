import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function findTrackById(ctx: DBContext, config: { id: string }) {
  return await ctx(tablenames.tracks).where(config).first();
}