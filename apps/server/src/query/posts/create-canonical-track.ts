import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TTrack } from "../../types/track-type";
import { createPost } from "./create-post";

export async function createCanonicalTrack(ctx: DBContext, config: {
  track: TTrack,
}) {
  const { moods, genre, waveform, ...rest } = config.track;
  const [track] = await ctx(tablenames.tracks)
    .insert({
      ...rest,
      waveform: JSON.stringify(waveform),
      track_status_id: db
        .select('id')
        .from(tablenames.contentStatuses)
        .where({ label: 'active' })
        .limit(1),
      genre_type_id: db.select('id').from(tablenames.genres).where({ label: genre }).limit(1)
    })
    .returning('id');

  //Insert tags
  await ctx(tablenames.trackMoods).insert(
    moods.map(tag => {
      return {
        track_id: track.id,
        mood_type_id: db.select('id').from(tablenames.moods).where({ label: tag }).limit(1),
      };
    }),
  );

  //Create post
  await createPost(
    ctx,
    {
      post: {
        track_id: track.id,
        user_id: rest.user_id,
      }
    },
  );
}