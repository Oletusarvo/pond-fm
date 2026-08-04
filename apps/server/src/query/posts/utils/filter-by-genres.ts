import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function filterByGenres(query: Knex.QueryBuilder, genres?: string[]) {
  if (!genres || genres.length == 0) return;
  query.whereIn('track.genre_type_id', db.select('id').from(tablenames.genres).whereIn('label', genres));
}