import { getUndiscoveredTracksHandler } from "../api/v1/tracks/handlers/feed/get-undiscovered-feed-handler";
import { getMainFeedHandler } from "../api/v1/tracks/handlers/feed/get-main-feed";
import { getAuthorFeed } from "../api/v1/tracks/handlers/feed/get-author-feed-handler";
import { getFollowedFeedHandler } from "../api/v1/tracks/handlers/feed/get-followed-feed";

import { getTrackHandler } from "../api/v1/tracks/handlers/get-track-handler";

import { deleteTrackHandler } from "../api/v1/tracks/handlers/delete-track-handler";
import { getAuthorRepostedFeedHandler } from "../api/v1/tracks/handlers/feed/get-author-reposted-feed-handler";
import { getAuthorLikedFeedHandler } from "../api/v1/tracks/handlers/feed/get-author-liked-feed-handler";
import { likeTrackHandler } from "../api/v1/tracks/handlers/like-track-handler";
import { unlikeTrackHandler } from "../api/v1/tracks/handlers/unlike-track-handler";
import { repostTrackHandler } from "../api/v1/tracks/handlers/repost-track-handler";
import { unrepostTrackHandler } from "../api/v1/tracks/handlers/unrepost-track-handler";
import { countPlayHandler } from "../api/v1/tracks/handlers/count-play-handler";

import { getStreamUrlHandler } from "../api/v1/tracks/handlers/get-stream-url";

export class TrackHandlerService {
  feed = {
    undiscovered: getUndiscoveredTracksHandler.bind(this) as typeof getUndiscoveredTracksHandler,
    main: getMainFeedHandler.bind(this) as typeof getMainFeedHandler,
    byAuthor: getAuthorFeed.bind(this) as typeof getAuthorFeed,
    byFollowed: getFollowedFeedHandler.bind(this) as typeof getFollowedFeedHandler,
    repostedBy: getAuthorRepostedFeedHandler.bind(this) as typeof getAuthorRepostedFeedHandler,
    likedBy: getAuthorLikedFeedHandler.bind(this) as typeof getAuthorLikedFeedHandler,
  };

  stream = getStreamUrlHandler;

  /**Returns a track by its id. */
  get = getTrackHandler.bind(this) as typeof getTrackHandler;

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
