const createLookupTable = require('../migration-utils/create-lookup-table');

const tablename = 'upload_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('upload')
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.uuid('upload_folder_id').notNullable().references('id').inTable('upload.upload_folder_data').onUpdate('CASCADE').onDelete('CASCADE');
      tbl.string('filename').notNullable();
      tbl.string('original_filename').notNullable();
      tbl.string('mime_type');
      tbl.string('key').notNullable();
      tbl.bigint('size_bytes');
      tbl.timestamps(true, true);
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
