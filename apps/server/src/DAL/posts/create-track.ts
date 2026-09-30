import { v4 } from "uuid";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { createTrackMoods } from "./create-track-tags";
import { getLookupQuery } from "../util/get-lookup-query";
import { TTrack } from "@pondfm/app-shared";

export async function createTrack(
  ctx: DBContext,
  config: { track: Pick<TTrack, "title" | "author_id" | "genre" | "moods"> },
) {
  const { moods, genre, title, author_id } = config.track;
  const [track] = (await ctx(tablenames.tracks)
    .insert({
      title,
      author_id,
      genre_id: getLookupQuery(tablenames.genres, genre),
    })
    .returning("*")) as [TTrack];
  await createTrackMoods(ctx, {
    track: { id: track.id, moods },
  });
  return track;
}
