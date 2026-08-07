import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { withTrack } from "./with/with-track";

export async function findTrackById(ctx: DBContext, config: { id: string }) {
  const query = ctx.queryBuilder();
  withTrack(query);
  return await query.from({ track: 'track' }).select('*').where({ id: config.id }).first();
}