import type { TAuthor } from './author';

export type TTrack = {
  id: string;
  title: string;
  duration: number;
  author: TAuthor;
  tags: string[];
  waveform: number[];
};
