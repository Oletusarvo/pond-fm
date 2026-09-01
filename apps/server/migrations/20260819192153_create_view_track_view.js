const viewname = 'track_view';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('post').createViewOrReplace(viewname, view => {
    view.as(
      knex.from({ track: 'post.track_data' })
        .join({ upload: 'upload.upload_data' }, 'upload.id', 'track.primary_audio_id')
        .join({ audio: 'upload.audio_data' }, 'audio.upload_id', 'upload.id')
        .join({ folder: 'upload.upload_folder_data' }, 'folder.id', 'upload.upload_folder_id')
        .select(
          'track.id',
          'track.title',
          'track.genre_id',
          'track.play_count',
          'track.unique_play_count',
          'audio.duration',
          'audio.waveform',
          'upload.size_bytes',
          'upload.key',
          'upload.mime_type',
          'folder.status',
          'folder.author_id',
          'folder.id AS upload_folder_id',
          'folder.created_at', 'folder.updated_at', 'folder.deleted_at'
        )
    )
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('post').dropViewIfExists(viewname);
};
