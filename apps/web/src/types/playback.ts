import { TTrackPublic } from "@pondfm/app-shared";

export type TPlayback = TTrackPublic & {
  start_position?: number;
  post_id: string;
  stats: {
    liked_by_me?: boolean;
    reposted_by_me?: boolean;
    play_count: number;
    repost_count: number;
    like_count: number;
  };
};
