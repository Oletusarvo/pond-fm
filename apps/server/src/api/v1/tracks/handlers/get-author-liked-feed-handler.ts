import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { applyCursor } from "../../../../DAL/posts/utils/apply-cursor";
import { getCursor } from "../../../../utils/get-cursor";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";
import { onlyCanonicalTracks } from "../../../../DAL/tracks/filter/only-canonical-tracks";
import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";
import { includeAudiusTrackData } from "../../../../utils/get-feed-handler";
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
