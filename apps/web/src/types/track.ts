import type { TAuthor } from './author';

export type TTrack = {
  id: string;
  title: string;
  duration: number;
  author: TAuthor;
  genre: string;
  moods: string[];
  waveform: number[];
};
