import { TSession } from "@pondfm/app-shared";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { selectLikedByMe } from "./select/select-liked-by-me";
import { selectRepostedByMe } from "./select/select-reposted-by-me";

export function getTrackQuery(ctx: DBContext, session?: TSession) {
  const query = ctx.queryBuilder();
  query.from({ track: viewnames.tracks });
  query.select("track.*");
  selectLikedByMe(query, session);
  selectRepostedByMe(query, session);
  return query;
}
