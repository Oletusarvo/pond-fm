import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";

import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns a track by its id. */
export const getTrackHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const query = getUndistinctPostQuery(db, req.session);
    selectPost(query);
    selectTrack(query);
    query.where({ "track.id": req.params.trackId as string }).first();

    return res.json(await query);
  },
);
