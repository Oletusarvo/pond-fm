import { TPlayback } from "../../../types/playback";

export type PlaybackReducerState = TPlayback &
  (
    | {
        status: "buffering";
      }
    | {
        status: "playing";
        streamUrl: string;
      }
    | {
        status: "error";
      }
  );
