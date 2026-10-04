import { Knex } from "knex";
import { viewnames } from "../../../tablenames";

export function withDistinctTrack(query: Knex.QueryBuilder) {
  query.with("distinct_track", (qb) => {
    qb.select("*").distinctOn("id").from(viewnames.tracks);
  });
}
