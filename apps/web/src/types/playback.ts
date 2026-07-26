import { TTrack } from './track';

export type TPlayback = TTrack & {
  stats: {
    liked_by_me?: boolean;
    reposted_by_me?: boolean;
    play_count: number;
    repost_count: number;
    like_count: number;
  };
};
