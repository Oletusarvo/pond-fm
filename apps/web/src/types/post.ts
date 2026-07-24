import type { TAuthor } from './author';
import type { TTrack } from './track';

export type TPost = {
  id: string;
  author: TAuthor;
  track: TTrack;
  is_canonical: boolean;
  created_at: string;
  liked_by_me: boolean;
  like_count: number;
  play_count: number;
  repost_count: number;
  reposted_by_me: boolean;
};
