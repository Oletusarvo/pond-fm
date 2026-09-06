import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

/**Removes a like from a track. */
export const unlikeTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await postService.unlikeTrack(db, {
      user_id: session.user.id,
      track_id: req.body.trackId,
    });
    return res.end();
  },
);
