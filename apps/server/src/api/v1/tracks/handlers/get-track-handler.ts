import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";

import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";
import { TAuthenticatedRequest } from "../../../../types/request";
import { onlyCanonicalTracks } from "../../../../DAL/tracks/filter/only-canonical-tracks";
import { getTrackQuery } from "../../../../DAL/tracks/get-track-query";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";
import { includeAudiusTrackData } from "../../../../utils/get-feed-handler";

/**Returns a track by its id. */
export const getTrackHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;

  const tracks = await includeAudiusTrackData(async () => {
    const query = getTrackQuery(db, {
      session,
    });

    onlyCanonicalTracks(query);
    query.where({ "track.audius_track_id": req.params.trackId as string }).first();
    const tracks = await query;
    return {
      items: [tracks],
      cursor: null,
    };
  });
  return res.json(tracks.items.at(0));
});
