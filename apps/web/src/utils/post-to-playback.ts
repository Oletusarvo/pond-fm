import { TPostPublic } from "@pondfm/app-shared";
import { TPlayback } from "../types/playback";

/**Converts a post to a playback-object. */
export function postToPlayback(post: TPostPublic): TPlayback {
  return {
    ...post?.track,
    post: {
      id: post.id,
    },
    track: post.track,
  };
}
