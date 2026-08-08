import { Knex } from "knex";
import { db } from "../../../db-config";

export function selectTrack(query: Knex.QueryBuilder) {
  query.select('track.json as track');
}