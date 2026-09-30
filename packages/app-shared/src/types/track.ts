import type z from "zod";
import type { trackPublicSchema, trackSchema } from "../schemas/track-schema.js";

/**The raw shape of tracks returned from the db. */
export type TTrack = z.infer<typeof trackSchema>;
/**The track type displayed to the public. */
export type TTrackPublic = z.infer<typeof trackPublicSchema>;
