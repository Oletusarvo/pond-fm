const tablename = 'audio_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('upload').createTable(tablename, tbl => {
    tbl.uuid('upload_id').primary().references('id').inTable('upload.upload_data').onDelete('CASCADE');
    tbl.float('duration');
    tbl.float('bitrate');
    tbl.jsonb('waveform');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('upload').dropTableIfExists(tablename)
};
