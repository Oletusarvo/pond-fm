import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function filterByMoods(query: Knex.QueryBuilder, moods?: string[]) {
  if (!moods || moods.length == 0) return;
  query.whereExists(function () {
    this.select(1)
      .from({ moods: tablenames.trackMoods })
      .join({ type: tablenames.moods }, "type.id", "moods.mood_id")
      .whereRaw("moods.track_id = track.audius_track_id")
      .whereIn("type.label", moods);
  });
}
