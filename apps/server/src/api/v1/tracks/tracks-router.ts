import { checkAuth } from "../../middleware/check-auth";
import { streamTrackHandler } from "./handlers/stream-track-handler";
import { verifyStreamToken } from "./middleware/verify-stream-token";
import { updateTrackSchema } from "../../../schemas/update-track-schema";
import { trackInteractionSchema } from "../../../schemas/track-interaction-schema";
import { createBodyParser, getRouter } from "@pondfm/server-utils";
import { handlers } from "../../../container";
import { getPlayCountStatsHandler } from "./handlers/get-track-stats-handler";
import { importAudiusTracksHandler } from "../users/handlers/import-audius-tracks-handler";
import { updateTrackHandler } from "./handlers/update-track-handler";

const router = getRouter();

/**
 * GET /tracks/feed/main
 * @summary Returns a feed of tracks sorted newest first.
 * @tags Tracks
 */
router.get("/new", checkAuth(false), handlers.tracks.feed.main);
/**
 * GET /tracks/feed/discover
 * @summary Returns a feed of tracks that have not hit their unique listeners threshold, sorted oldest first.
 * @tags Tracks
 */
router.get("/undiscovered", checkAuth(false), handlers.tracks.feed.undiscovered);
/**
 * GET /tracks/feed/discover
 * @summary Returns a feed of tracks from users the currently authenticated user is following.
 * @tags Tracks
 */
router.get("/followed", checkAuth(), handlers.tracks.feed.byFollowed);
/**
 * GET /tracks/feed/search
 * @summary Returns a feed of tracks where the title or author username matches the q-search parameter.
 * @tags Tracks
 */
router.get("/feed/search", checkAuth(false), handlers.tracks.feed.search);
/**
 * GET /tracks/feed/:authorId
 * @summary Returns a feed of tracks by a specific user by id.
 * @tags Tracks
 */
router.get("/feed/:authorId", checkAuth(false), handlers.tracks.feed.byAuthor);
/**
 * GET /tracks/feed/:authorId/reposted
 * @summary Returns tracks reposted by a user.
 * @tags Tracks
 */
router.get("/feed/:authorId/reposted", checkAuth(false), handlers.tracks.feed.repostedBy);
/**
 * GET /tracks/feed/:authorId/liked
 * @summary Returns tracks liked by a user.
 * @tags Tracks
 */
router.get("/feed/:authorId/liked", checkAuth(false), handlers.tracks.feed.likedBy);
/**
 * GET /tracks/:id
 * @summary Returns a specific track by id.
 * @tags Tracks
 */

/**
 * POST /tracks/like
 * @summary Adds a like by the currently authenticated user on a track by id.
 * @tags Tracks
 */
router.post("/like", checkAuth(), handlers.tracks.like);
/**
 * DELETE /tracks/like
 * @summary Deletes a like by the currently authenticated user on a track by id.
 * @tags Tracks
 */
router.delete("/like", checkAuth(), handlers.tracks.unlike);
/**
 * POST /tracks/repost
 * @summary Adds a repost by the currently authenticated user of a track by id.
 * @tags Tracks
 */
router.post(
  "/repost",
  checkAuth(),
  createBodyParser(trackInteractionSchema),
  handlers.tracks.repost,
);
/**
 * DELETE /tracks/repost
 * @summary Deletes a repost by the currently authenticated user of a track by id.
 * @tags Tracks
 */
router.delete(
  "/repost",
  checkAuth(),
  createBodyParser(trackInteractionSchema),
  handlers.tracks.unrepost,
);

/**
 * POST /tracks/:id/play
 * @summary Increments the play count of a track by id. Requests will only be processed if a valid stream token is present.
 * @tags Tracks
 */
router.post("/:trackId/play", verifyStreamToken, handlers.tracks.countPlay);
/**
 * GET /tracks/:id/stream
 * @summary Returns a url from which a track can be streamed. Also creates a stream session, and sets a stream cookie used in play counting, liking and reposting.
 */
router.get("/:trackId/stream/url", checkAuth(false), handlers.tracks.stream);

/**
 * DELETE /tracks/:id
 * @summary Deletes a track by id.
 * @tags Tracks
 */
router.delete("/:trackId", checkAuth(), handlers.tracks.delete);
router.get("/:trackId", checkAuth(false), handlers.tracks.get);
router.put("/:trackId", checkAuth(), updateTrackHandler);

router.patch("/audius/import", checkAuth(), importAudiusTracksHandler);

export { router as tracksRouter };
