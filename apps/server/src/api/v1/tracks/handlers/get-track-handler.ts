import { createHandler } from "@pondfm/server-utils";
import { withTrack } from "../../../../DAL/posts/with/with-track";
import { db } from "../../../../db-config";
import { getPostQuery } from "../../../../DAL/posts/get-post-query";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { fromUndistinctPost } from "../../../../DAL/posts/from/from-undistinct-post";
import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";

export const getTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const query = getUndistinctPostQuery(db);
    selectPost(query, req.session);
    selectTrack(query);
    query.where({ 'track.id': req.params.trackId as string }).first();

    return res.json(await query);
  }
)