import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyDefaultTrackSelection } from "./util/apply-default-track-selection";

export function getTrackQuery(ctx: DBContext, config: FeedQueryConfig) {
  const query = ctx.queryBuilder();
  query.select("track.*");
  applyDefaultTrackSelection(query, config);
  return query;
}
