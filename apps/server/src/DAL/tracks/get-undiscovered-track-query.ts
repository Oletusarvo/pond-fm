import { TSession } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getTrackQuery } from "./get-track-query";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { fromUndistinctPost } from "../posts/from/from-undistinct-post";
import { fromUndistinctTrack } from "./from/from-undistinct-track";

export function getUndiscoveredTrackQuery(ctx: DBContext, config?: FeedQueryConfig) {
  const query = getTrackQuery(ctx, config);
  fromUndistinctTrack(query);
  query.where({ is_discovered: false, is_canonical: true });
  return query;
}
