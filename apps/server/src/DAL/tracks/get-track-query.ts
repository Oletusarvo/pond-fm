import { DBContext } from "../../types/db-context";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { onlyReadyTracks } from "./filter/only-ready-tracks";
import { applyDefaultTrackSelection } from "./util/apply-default-track-selection";

export function getTrackQuery(ctx: DBContext, config: FeedQueryConfig) {
  const query = ctx.queryBuilder();
  applyDefaultTrackSelection(query, config);
  query.select("track.*");
  onlyReadyTracks(query);
  return query;
}
