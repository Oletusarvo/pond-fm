import { checkAuth } from "../../middleware/check-auth";
import { getDiscoveryFeed } from "./handlers/get-discovery-feed";
import { likeTrackHandler } from "./handlers/like-track-handler";
import { repostTrackHandler } from "./handlers/repost-track-handler";
import { streamTrackHandler } from "./handlers/stream-track-handler";
import { unlikeTrackHandler } from "./handlers/unlike-track-handler";
import { unrepostTrackHandler } from "./handlers/unrepost-track-handler";
import { countPlayHandler } from "./handlers/count-play-handler";
import { getAuthorFeed } from "./handlers/get-author-feed-handler";
import { getStreamTokenHandler } from "./handlers/get-stream-token-handler";
import { verifyStreamToken } from "./middleware/verify-stream-token";
import { getMainFeedHandler } from "./handlers/get-main-feed";
import { updateTrackHandler } from "./handlers/update-track-handler";
import { updateTrackSchema } from "../../../schemas/update-track-schema";
import { getFollowedFeedHandler } from "./handlers/get-followed-feed";
import { getTrackHandler } from "./handlers/get-track-handler";
import { deleteTrackHandler } from "./handlers/delete-track-handler";
import { trackInteractionSchema } from "../../../schemas/track-interaction-schema";
import { createBodyParser, getRouter } from "@pondfm/server-utils";
import { getAuthorRepostedFeedHandler } from "./handlers/get-author-reposted-feed-handler";
import { getAuthorLikedFeedHandler } from "./handlers/get-author-liked-feed-handler";

const router = getRouter();

/**
 * GET /tracks/feed/main
 * @summary Returns a feed of tracks sorted newest first.
 * @tags Tracks
 */
router.get("/feed/main", checkAuth(false), getMainFeedHandler);
/**
 * GET /tracks/feed/discover
 * @summary Returns a feed of tracks that have not hit their unique listeners threshold, sorted oldest first.
 * @tags Tracks
 */
router.get("/feed/discover", checkAuth(false), getDiscoveryFeed);
/**
 * GET /tracks/feed/discover
 * @summary Returns a feed of tracks from users the currently authenticated user is following.
 * @tags Tracks
 */
router.get("/feed/followed", checkAuth(), getFollowedFeedHandler);
/**
 * GET /tracks/feed/:authorId
 * @summary Returns a feed of tracks by a specific user by id.
 * @tags Tracks
 */
router.get("/feed/:authorId", checkAuth(false), getAuthorFeed);
/**
 * GET /tracks/feed/:authorId/reposted
 * @summary Returns tracks reposted by a user.
 * @tags Tracks
 */
router.get(
  "/feed/:authorId/reposted",
  checkAuth(false),
  getAuthorRepostedFeedHandler,
);
/**
 * GET /tracks/feed/:authorId/liked
 * @summary Returns tracks liked by a user.
 * @tags Tracks
 */
router.get(
  "/feed/:authorId/liked",
  checkAuth(false),
  getAuthorLikedFeedHandler,
);
/**
 * GET /tracks/:id
 * @summary Returns a specific track by id.
 * @tags Tracks
 */
router.get("/:trackId", getTrackHandler);
/**
 * POST /tracks/like
 * @summary Adds a like by the currently authenticated user on a track by id.
 * @tags Tracks
 */
router.post("/like", checkAuth(), likeTrackHandler);
/**
 * DELETE /tracks/like
 * @summary Deletes a like by the currently authenticated user on a track by id.
 * @tags Tracks
 */
router.delete("/like", checkAuth(), unlikeTrackHandler);
/**
 * POST /tracks/repost
 * @summary Adds a repost by the currently authenticated user of a track by id.
 * @tags Tracks
 */
router.post(
  "/repost",
  checkAuth(),
  createBodyParser(trackInteractionSchema),
  repostTrackHandler,
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
  unrepostTrackHandler,
);
/**
 * POST /tracks/:id/play
 * @summary Increments the play count of a track by id. Requests will only be processed if a valid stream token is present.
 * @tags Tracks
 */
router.post("/:trackId/play", verifyStreamToken, countPlayHandler);
/**
 * GET /tracks/:id/stream/token
 * @summary Returns a stream token for a track by id.
 * @tags Tracks
 */
router.get("/:trackId/stream/token", getStreamTokenHandler);
/**
 * GET /tracks/:id/stream
 * @summary Starts a stream of a track by id.
 * @deprecated This endpoint is no longer maintained; make requests to the streamUrl returned by /tracks/:id/stream/token instead.
 */
router.get("/:trackId/stream", streamTrackHandler);
/**
 * PUT /tracks/:id
 * @summary Updates the data of a track by id.
 * @tags Tracks
 */
router.put(
  "/:trackId",
  checkAuth(),
  createBodyParser(updateTrackSchema),
  updateTrackHandler,
);
/**
 * DELETE /tracks/:id
 * @summary Deletes a track by id.
 * @tags Tracks
 */
router.delete("/:trackId", checkAuth(), deleteTrackHandler);
export { router as tracksRouter };
