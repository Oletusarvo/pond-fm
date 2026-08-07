import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TTrack } from "../../types/track-type";

export async function updateTrack(ctx: DBContext, config: Partial<TTrack>) {
  const { moods, genre, ...rest } = config;
  const payload: Record<string, any> = { ...rest };
  if (genre) {
    payload.genre_id = db.select('id').from(tablenames.genres).where({ label: genre }).limit(1)
  }

  await ctx(tablenames.tracks).where({ id: config.id }).update({
    ...payload,
  });

  if (moods) {
    await ctx(tablenames.trackMoods).where({ track_id: config.id }).del();
    await ctx(tablenames.trackMoods).insert(moods.map(m => {
      return {
        track_id: config.id,
        mood_id: db.select('id').from(tablenames.moods).where({ label: m }).limit(1)
      }
    }));
  }
}