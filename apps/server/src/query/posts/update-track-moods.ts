import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function updateTrackMoods(ctx: DBContext, config: { track: { id: string; moods?: string[] } }) {
  await ctx(tablenames.trackMoods).where({ track_id: config.track.id }).del();
  await ctx(tablenames.trackMoods).insert(
    config.track.moods?.map(tag => {
      return {
        track_id: config.track.id,
        mood_type_id: db.select('id').from(tablenames.tagLabels).where({ label: tag }).limit(1),
      };
    }),
  );
}