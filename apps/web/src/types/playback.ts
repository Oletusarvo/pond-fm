import { TTrack } from './track';

export type TPlayback = TTrack & {
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
