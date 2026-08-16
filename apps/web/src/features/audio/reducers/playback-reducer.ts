import { TPlayback } from "../../../types/playback";

export type PlaybackReducerState = TPlayback & ({
  status: 'buffering';
} | {
  status: 'ready';
  streamUrl: string;
} | {
  status: 'error'
});