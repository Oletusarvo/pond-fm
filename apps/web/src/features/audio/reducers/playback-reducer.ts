import { TPlayback } from "../../../types/playback";

export type PlaybackReducerState = TPlayback & {
  streamUrl?: string;
  status: "ready" | "buffering" | "error";
  state: "playing" | "paused";
};
