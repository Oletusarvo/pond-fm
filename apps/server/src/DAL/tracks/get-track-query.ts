import { TSession } from "@pondfm/app-shared";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { selectLikedByMe } from "./select/select-liked-by-me";
import { selectRepostedByMe } from "./select/select-reposted-by-me";
import { filterByGenres } from "./filter/filter-by-genres";
import { filterByMoods } from "./filter/filter-by-moods";
import { FeedQueryConfig } from "../posts/types/feed-config";
import { applyCursor } from "../posts/utils/apply-cursor";

export function getTrackQuery(ctx: DBContext, config: FeedQueryConfig) {
  const query = ctx.queryBuilder();
  query.select("track.*");
  selectLikedByMe(query, config.session);
  selectRepostedByMe(query, config.session);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);

  return query;
}
