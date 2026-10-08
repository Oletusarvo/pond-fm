import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { audius } from "../../../../audius.config";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";

export const importAudiusTracksHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  const userId = session.user.id;
  const count = await audius.users.tracks.count(userId);

  if (count == 0) return res.status(204).end();

  await db.transaction(async (trx) => {
    const pageSize = 50;
    for (let page = 0; page < count; page += pageSize) {
      const tracks = await audius.users.tracks.get(userId, page, pageSize);
      const tracksToInsert = tracks.map((track) => {
        return {
          id: track.id,
          status: "pending_import",
          genre_id: getLookupQuery(tablenames.genres, track.genre.toLowerCase()),
          author_id: session.user.id,
          created_at: track.created_at,
        };
      });
      const insertedTracks = await trx(tablenames.tracks)
        .insert(tracksToInsert)
        .onConflict()
        .ignore()
        .returning("id");
      if (insertedTracks.length > 0) {
        await trx(tablenames.posts).insert(
          insertedTracks.map((track) => {
            return {
              track_id: track.id,
              author_id: session.user.id,
            };
          }),
        );
      }
    }
  });
  return res.end();
});
