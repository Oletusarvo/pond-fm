import { TSession } from "@pondfm/app-shared";
import { DBContext } from "../../types/db-context";
import { getTrackQuery } from "./get-track-query";

export function getUndiscoveredTrackQuery(ctx: DBContext, session?: TSession) {
  const query = getTrackQuery(ctx, session);
  query.where({ is_discovered: false });
  return query;
}
