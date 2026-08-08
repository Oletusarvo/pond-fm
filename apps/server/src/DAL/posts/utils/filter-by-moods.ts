import { Knex } from "knex";

export function filterByMoods(query: Knex.QueryBuilder, moods?: string[]) {
  if (!moods || moods.length == 0) return;
  query
    .whereExists(function () {
      this.select(1)
        .from('moods')
        .whereRaw("moods.track_id = track.id")
        .whereIn('label', moods);
    });
}