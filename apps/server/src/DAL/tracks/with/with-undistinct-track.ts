import { Knex } from "knex";
import { viewnames } from "../../../tablenames";

export function withUndistinctTrack(query: Knex.QueryBuilder) {
  query.with("undistinct_track", (qb) => {
    qb.select("*").from(viewnames.tracks);
  });
}
