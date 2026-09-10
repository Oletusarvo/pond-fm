import { TPost, TTrackPublic } from "@pondfm/app-shared";

/**The type used to represent a track being played. */
export type TPlayback = {
  /**At what time the track starts playing. */
  start_position?: number;
  /**The post publishing the track. */
  post: Pick<TPost, "id">;
  /**The track. */
  track: TTrackPublic;
  /**The statistics of the track. */
  stats: {
    /**Is the track liked by the currently authorized user? */
    liked_by_me?: boolean;
    /**Is the track reposted by the currently authorized user? */
    reposted_by_me?: boolean;
    /**The amount of times the track has been played. */
    play_count: number;
    /**The amount of times the track has been reposted.*/
    repost_count: number;
    /**The amount of times the track has been liked. */
    like_count: number;
  };
};
