import { Knex } from "knex";
import { db } from "../../../db-config";

export function selectTrack(query: Knex.QueryBuilder) {
  query.select(
    db.raw(
      `
          JSON_BUILD_OBJECT(
            'id', track.id, 
            'title', track.title, 
            'author', track_author.json,
            'duration', track.duration,
            'genre', track_genre.label,
            'moods', (
              SELECT JSON_AGG(label) FROM moods
              WHERE 
              moods.track_id = track.id
            ),
            'waveform', track.waveform
          ) AS track
        `,
    ),
  );
}