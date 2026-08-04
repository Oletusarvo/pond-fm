import { TCursor } from "../../../types/cursor";
import { TSession } from "../../../types/session";

export type FeedQueryConfig = {
  cursor?: TCursor; session?: TSession; genres?: string[]; moods?: string[]
}