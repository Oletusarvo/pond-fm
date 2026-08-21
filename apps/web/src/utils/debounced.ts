import { apiService } from './api/api-service';
import { cancelPrevious, debounce } from './debounce';

/**Provides useful debounced methods. */
export const debounced = {
  toggleTrackLike: debounce(async (trackId: string, isLiked: boolean) => {
    return isLiked ? apiService.unlikeTrack(trackId) : apiService.likeTrack(trackId);
  }, 700),
};

export const cancelable = {
  toggleTrackLike: cancelPrevious(async (trackId: string, isLiked: boolean) => {
    return isLiked ? apiService.unlikeTrack(trackId) : apiService.likeTrack(trackId);
  }, 1000),

  repost: cancelPrevious(async (trackId: string, isReposted: boolean) => {
    return !isReposted ? apiService.repostTrack(trackId) : null;
  }, 1000),

  toggleFollow: cancelPrevious(async (userId: string, isFollowed: boolean) => {
    return !isFollowed ? apiService.follow(userId) : apiService.unfollow(userId);
  }, 1000)
};
