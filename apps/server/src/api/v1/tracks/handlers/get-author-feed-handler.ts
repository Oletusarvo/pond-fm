import { db } from "../../../../db-config";
import { getAuthorPosts } from "../../../../DAL/posts/get-author-posts";
import { createHandler } from "@pondfm/server-utils";
import { getCursor } from "../../../../utils/get-cursor";
import { TAuthenticatedRequest } from "../../../../types/request";
import { includeAudiusTrackData } from "../../../../utils/include-audius-track-data";
import { getAuthorTracks } from "../../../../DAL/tracks/get-author-tracks";

/**Returns a feed of tracks posted by a specific user. */
export const getAuthorFeed = createHandler(async (req: TAuthenticatedRequest, res) => {
  const { authorId } = req.params as { authorId: string };
  const session = req.session;
  const cursor = getCursor(req);
  const result = await includeAudiusTrackData(
    async () =>
      await getAuthorTracks(db, {
        canonical_author_id: authorId,
        session,
        cursor,
      }),
  );
  return res.json(result);
});
