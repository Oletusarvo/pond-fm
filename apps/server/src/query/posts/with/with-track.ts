import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function withTrack(query: Knex.QueryBuilder) {
  query.with('track', qb => {
    qb.from({ track: tablenames.tracks })
      .join({ upload: tablenames.uploads }, 'upload.id', 'track.primary_audio_id')
      .join({ audio: tablenames.audio }, 'audio.upload_id', 'track.primary_audio_id')
      .select('track.*', 'audio.duration')
  });
}