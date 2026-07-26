import { TPlayback } from '../types/playback';
import { TPost } from '../types/post';

/**Converts a post to a playback-object. */
export function postToPlayback(post: TPost): TPlayback {
  return {
    ...post.track,
    stats: {
      liked_by_me: post.liked_by_me,
      reposted_by_me: post.reposted_by_me,
      like_count: post.like_count,
      repost_count: post.repost_count,
      play_count: post.play_count,
    },
  };
}
