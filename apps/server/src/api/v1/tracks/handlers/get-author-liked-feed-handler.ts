import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { db } from "../../../../db-config";
import { getCursor } from "../../../../utils/get-cursor";
import { includeAudiusTrackData } from "../../../../utils/include-audius-track-data";
import { getAuthorLikedTracks } from "../../../../DAL/tracks/get-author-liked-tracks";

/**Returns tracks liked by a specific user. */
export const getAuthorLikedFeedHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const cursor = getCursor(req);
  const authorId = req.params.authorId as string;
  const session = req.session;
  const json = await includeAudiusTrackData(
    async () =>
      await getAuthorLikedTracks(db, {
        cursor,
        author_id: authorId,
        session,
      }),
  );
  return res.json(json);
});
