import { Knex } from "knex";
import { viewnames } from "../../../tablenames";

export function fromDistinctTrack(query: Knex.QueryBuilder) {
  query
    .with("distinct_track", (qb) => {
      qb.select("*").distinctOn("id").from(viewnames.tracks);
    })
    .from({ track: "distinct_track" });
}
