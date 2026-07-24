import { apiService } from './api-service';
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
  }, 700),

  repost: cancelPrevious(async (trackId: string, isReposted: boolean) => {
    return !isReposted ? apiService.repostTrack(trackId) : null;
  }, 700),
};
