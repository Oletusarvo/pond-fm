import { TSession } from "@pondfm/app-shared";
import { TCursor } from "../../../types/cursor";

export type FeedQueryConfig = {
  cursor?: TCursor; session?: TSession; genres?: string[]; moods?: string[]
}