import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { trackInteractionSchema } from "../../../../schemas/track-interaction-schema";

/**Removes a like from a track. */
export const unlikeTrackHandler = createHandler(
  async (
    req: TAuthenticatedRequest<z.infer<typeof trackInteractionSchema>>,
    res,
  ) => {
    const session = req.session;
    await postService.unlikeTrack(db, {
      user_id: session.user.id,
      track_id: req.body.trackId,
    });
    return res.end();
  },
);
