import { v4 } from "uuid";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TTrack } from "../../types/track-type";
import { createTrackMoods } from "./create-track-tags";
import { getLookupQuery } from "../util/get-lookup-query";

export async function createTrack(ctx: DBContext, config: { track: { title: string; audioId: string; genre: string; moods: string[], authorId: string } }) {
  const { moods, genre, audioId, title, authorId } = config.track;
  const [track] = await ctx(tablenames.tracks)
    .insert({
      title,
      author_id: authorId,
      primary_audio_id: audioId,
      genre_id: getLookupQuery(tablenames.genres, genre)
    })
    .returning('*');
  await createTrackMoods(ctx, {
    track: { id: track.id, moods }
  });
  return track;
}