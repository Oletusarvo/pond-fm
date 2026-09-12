import { getUndiscoveredFeedHandler } from "../api/v1/tracks/handlers/get-undiscovered-feed-handler";
import { getMainFeedHandler } from "../api/v1/tracks/handlers/get-main-feed";
import { getAuthorFeed } from "../api/v1/tracks/handlers/get-author-feed-handler";
import { getFollowedFeedHandler } from "../api/v1/tracks/handlers/get-followed-feed";
import { createUploadHandler } from "../api/v1/upload/handlers/create-upload-handler";
import { completeUploadHandler } from "../api/v1/upload/handlers/complete-upload-handler";
import { getTrackHandler } from "../api/v1/tracks/handlers/get-track-handler";
import { updateTrackHandler } from "../api/v1/tracks/handlers/update-track-handler";
import { deleteTrackHandler } from "../api/v1/tracks/handlers/delete-track-handler";
import { getAuthorRepostedFeedHandler } from "../api/v1/tracks/handlers/get-author-reposted-feed-handler";
import { getAuthorLikedFeedHandler } from "../api/v1/tracks/handlers/get-author-liked-feed-handler";
import { likeTrackHandler } from "../api/v1/tracks/handlers/like-track-handler";
import { unlikeTrackHandler } from "../api/v1/tracks/handlers/unlike-track-handler";
import { repostTrackHandler } from "../api/v1/tracks/handlers/repost-track-handler";
import { unrepostTrackHandler } from "../api/v1/tracks/handlers/unrepost-track-handler";
import { getStreamTokenHandler } from "../api/v1/tracks/handlers/get-stream-token-handler";
import { countPlayHandler } from "../api/v1/tracks/handlers/count-play-handler";
import { getSearchFeedHandler } from "../api/v1/tracks/handlers/get-search-feed";

export class TrackHandlerService {
  feed = {
    undiscovered: getUndiscoveredFeedHandler.bind(
      this,
    ) as typeof getUndiscoveredFeedHandler,
    main: getMainFeedHandler.bind(this) as typeof getMainFeedHandler,
    byAuthor: getAuthorFeed.bind(this) as typeof getAuthorFeed,
    byFollowed: getFollowedFeedHandler.bind(
      this,
    ) as typeof getFollowedFeedHandler,
    repostedBy: getAuthorRepostedFeedHandler.bind(
      this,
    ) as typeof getAuthorRepostedFeedHandler,
    likedBy: getAuthorLikedFeedHandler.bind(
      this,
    ) as typeof getAuthorLikedFeedHandler,
    search: getSearchFeedHandler.bind(this) as typeof getSearchFeedHandler,
  };

  create = {
    /**Requests an upload url. */
    requestUploadUrl: createUploadHandler.bind(
      this,
    ) as typeof createUploadHandler,
    /**Completes an upload. */
    complete: completeUploadHandler.bind(this) as typeof completeUploadHandler,
  };

  stream = {
    /**Sets a stream token as a cookie; used for counting plays. Returns a stream url as the body of the response.*/
    token: getStreamTokenHandler.bind(this) as typeof getStreamTokenHandler,
  };

  /**Returns a track by its id. */
  get = getTrackHandler.bind(this) as typeof getTrackHandler;

  /**Updates a track by its id. */
  update = updateTrackHandler.bind(this) as typeof updateTrackHandler;

  /**Deletes a track by its id. */
  delete = deleteTrackHandler.bind(this) as typeof deleteTrackHandler;

  /**Likes a track by the currently authenticated user. */
  like = likeTrackHandler.bind(this) as typeof likeTrackHandler;

  /**Unlikes a track by the currently authenticated user. */
  unlike = unlikeTrackHandler.bind(this) as typeof unlikeTrackHandler;

  /**Reposts a track by the currently authenticated user. */
  repost = repostTrackHandler.bind(this) as typeof repostTrackHandler;

  /**Removes a repost by the currently authenticated user. */
  unrepost = unrepostTrackHandler.bind(this) as typeof unrepostTrackHandler;

  /**Counts a play on a track. */
  countPlay = countPlayHandler.bind(this) as typeof countPlayHandler;
}
