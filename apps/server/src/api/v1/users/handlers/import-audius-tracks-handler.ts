import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { audius } from "../../../../audius.config";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";

export const importAudiusTracksHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  const userId = session.user.audius_user_id;
  const count = await audius.users.tracks.count(userId);

  if (count == 0) return res.status(204).end();

  await db.transaction(async (trx) => {
    const pageSize = 50;
    for (let page = 0; page < count; page += pageSize) {
      const tracks = await audius.users.tracks.get(userId, page, pageSize);
      const tracksToInsert = tracks.map((track) => {
        return {
          audius_track_id: track.id,
          status: "active",
          genre_id: getLookupQuery(tablenames.genres, track.genre.toLowerCase()),
          author_id: session.user.audius_user_id,
          created_at: track.created_at,
        };
      });
      const insertedTracks = await trx(tablenames.tracks)
        .insert(tracksToInsert)
        .returning("audius_track_id");
      await trx(tablenames.posts).insert(
        insertedTracks.map((track) => {
          return {
            track_id: track.audius_track_id,
            author_id: session.user.audius_user_id,
          };
        }),
      );
    }
  });
  return res.end();
});
