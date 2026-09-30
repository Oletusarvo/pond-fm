import { TSession } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getTrackQuery } from "./get-track-query";
import { FeedQueryConfig } from "../posts/types/feed-config";

export function getUndiscoveredTrackQuery(ctx: DBContext, config?: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  query.where({ is_discovered: false });
  return query;
}
