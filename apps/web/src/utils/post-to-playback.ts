import { TTrackPublic } from "@pondfm/app-shared";
import { TPlayback } from "../types/playback";

/**Converts a post to a playback-object. */
export function trackToPlayback(track: TTrackPublic): TPlayback {
  return {
    post: {
      id: track.post_id,
    },
    track,
    stats: {
      liked_by_me: track.liked_by_me,
      reposted_by_me: track.reposted_by_me,
      play_count: track.play_count,
      like_count: track.like_count,
      repost_count: track.repost_count,
    },
  };
}
