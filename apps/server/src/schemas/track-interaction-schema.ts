import { trackSchema } from "@pondfm/app-shared";
import z from "zod";

/**
 * @summary The schema used to validate the bodies of requests sent to the /tracks/like, or /tracks/repost endpoints.
 */
export const trackInteractionSchema = z.object({
  trackId: trackSchema.shape.audius_track_id,
});
