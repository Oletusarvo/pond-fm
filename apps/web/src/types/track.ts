import type { TAuthor } from './author';

export type TTrack = {
  id: string;
  title: string;
  play_count: number;
  like_count: number;
  repost_count: number;
  duration: number;
  author: TAuthor;
  tags: string[];
  waveform: number[];
};
