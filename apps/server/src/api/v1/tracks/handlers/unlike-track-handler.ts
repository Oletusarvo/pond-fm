import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { trackInteractionSchema } from "../../../../schemas/track-interaction-schema";
import { audius } from "../../../../audius.config";

/**Removes a like from a track. */
export const unlikeTrackHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof trackInteractionSchema>>, res) => {
    const session = req.session;
    const trackId = req.params.trackId as string;
    await services.posts.unlikeTrack(db, {
      user_id: session.user.id,
      track_id: trackId,
    });
    audius.tracks.unlike(trackId, session.user.id).catch((err) => {
      console.log("Failed to unlike track on Audius!", err.message);
    });
    return res.end();
  },
);
