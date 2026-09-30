import { Knex } from "knex";

export function onlyCanonicalTracks(query: Knex.QueryBuilder) {
  query.where({ is_canonical: true });
}
