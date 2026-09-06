import { TPost, TTrackPublic } from "@pondfm/app-shared";

export type TPlayback = {
  start_position?: number;
  post: Pick<TPost, 'id'>;
  track: TTrackPublic;
  stats: {
    liked_by_me?: boolean;
    reposted_by_me?: boolean;
    play_count: number;
    repost_count: number;
    like_count: number;
  };
};
