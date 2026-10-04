import { Knex } from "knex";
import { selectLikedByMe } from "../select/select-liked-by-me";
import { selectRepostedByMe } from "../select/select-reposted-by-me";
import { filterByGenres } from "../filter/filter-by-genres";
import { filterByMoods } from "../filter/filter-by-moods";
import { FeedQueryConfig } from "../../posts/types/feed-config";

export function applyDefaultTrackSelection(query: Knex.QueryBuilder, config: FeedQueryConfig) {
  selectLikedByMe(query, config.session);
  selectRepostedByMe(query, config.session);
  filterByGenres(query, config.genres);
  filterByMoods(query, config.moods);
}
