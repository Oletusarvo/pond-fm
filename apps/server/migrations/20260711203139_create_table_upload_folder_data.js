const tablename = 'upload_folder_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('upload')
    .raw("CREATE TYPE upload.upload_status AS ENUM ('pending_upload', 'pending_review', 'pending_deletion', 'processing_audio', 'processing_waveform', 'active', 'deleted', 'failed_upload', 'failed_waveform_generation')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.uuid('author_id').notNullable().references('id').inTable('auth.user_data').onUpdate('CASCADE').onDelete('CASCADE');
      tbl.specificType('status', 'upload.upload_status').defaultTo('pending_upload');
      tbl.timestamps(true, true);
      tbl.timestamp('deleted_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('upload')
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS upload.upload_status");
};
