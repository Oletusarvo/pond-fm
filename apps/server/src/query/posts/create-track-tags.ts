import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";

export async function createTrackMoods(ctx: DBContext, config: { track: { id: string; moods?: string[]; } }) {
  //Insert tags
  await ctx(tablenames.trackMoods).insert(
    config.track.moods?.map(tag => {
      return {
        track_id: config.track.id,
        mood_id: getLookupQuery(tablenames.moods, tag),
      };
    }),
  );
}