import { TPlayback } from "../../../types/playback";

export type PlaybackReducerState = TPlayback & {
  streamUrl?: string;
  state: "playing" | "paused" | "buffering" | "rate-limited" | "ready" | "error";
};
