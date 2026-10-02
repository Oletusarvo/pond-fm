import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { updateTrackSchema } from "../../../../schemas/update-track-schema";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";

export const updateTrackHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof updateTrackSchema>>, res) => {
    const { trackId } = req.params;
    const { moods, genre } = req.body;
    const session = req.session;
    console.log(moods, genre);
    await db.transaction(async (trx) => {
      if (moods) {
        await trx(tablenames.trackMoods)
          .where({
            track_id: db.select("audius_track_id").from({ tracks: tablenames.tracks }).where({
              audius_track_id: trackId,
              author_id: session.user.audius_user_id,
            }),
          })
          .del();

        await trx(tablenames.trackMoods).insert(
          moods.map((mood) => {
            return {
              track_id: trackId,
              mood_id: getLookupQuery(tablenames.moods, mood),
            };
          }),
        );
      }

      if (genre) {
        await trx(tablenames.tracks)
          .where({ audius_track_id: trackId, author_id: session.user.audius_user_id })
          .update({
            genre_id: getLookupQuery(tablenames.genres, genre),
          });
      }
    });
    return res.end();
  },
);
