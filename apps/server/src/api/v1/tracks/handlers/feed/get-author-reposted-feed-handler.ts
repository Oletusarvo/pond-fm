import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../../types/request";
import { db } from "../../../../../db-config";
import { getCursor } from "../../../../../utils/get-cursor";
import { includeAudiusTrackData } from "../../../../../utils/include-audius-track-data";
import { getAuthorRepostedTracks } from "../../../../../DAL/tracks/get-author-reposted-tracks";

/**Returns tracks reposted by a user. */
export const getAuthorRepostedFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const authorId = req.params.authorId as string;
    const cursor = getCursor(req);
    const session = req.session;
    const json = await includeAudiusTrackData(
      async () =>
        await getAuthorRepostedTracks(db, {
          cursor,
          author_id: authorId,
          session,
        }),
    );

    return res.json(json);
  },
);
