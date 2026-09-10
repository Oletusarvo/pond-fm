import { api } from "./api/api";
import { cancelPrevious, debounce } from "./debounce";

/**Provides useful debounced methods. */
export const debounced = {
  toggleTrackLike: debounce(async (trackId: string, isLiked: boolean) => {
    return isLiked ? api.tracks.unlike(trackId) : api.tracks.like(trackId);
  }, 700),
};

/**Contains useful methods called from within the cancelPrevious-method. */
export const cancelable = {
  /**Toggles a like on a track. */
  toggleTrackLike: cancelPrevious(async (trackId: string, isLiked: boolean) => {
    return isLiked ? api.tracks.unlike(trackId) : api.tracks.like(trackId);
  }, 1000),

  repost: cancelPrevious(async (trackId: string, isReposted: boolean) => {
    return !isReposted ? api.tracks.repost(trackId) : null;
  }, 1000),

  toggleFollow: cancelPrevious(async (userId: string, isFollowed: boolean) => {
    return !isFollowed ? api.users.follow(userId) : api.users.unfollow(userId);
  }, 1000),
};
