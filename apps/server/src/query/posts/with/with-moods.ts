import { Knex } from "knex";
import { tablenames } from "../../../tablenames"

export function withMoods(query: Knex.QueryBuilder) {
  query.with('moods', qb => {
    qb.select('track_id', 'mood_type.label')
      .from({ track_mood: tablenames.trackMoods })
      .join('mood_type', 'mood_type.id', 'track_mood.mood_type_id')
  });
}