import { Knex } from "knex";

export function onlyReadyTracks(query: Knex.QueryBuilder) {
  query.where({ "track.status": "active" });
}
