const createLookupTable = require('../migration-utils/create-lookup-table');

const tablename = 'upload_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('upload')
    .raw("CREATE TYPE upload.upload_status AS ENUM ('ready', 'processing', 'pending')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.specificType('status', 'upload.upload_status').notNullable().defaultTo('pending');
      tbl.string('filename').notNullable();
      tbl.string('original_filename').notNullable();
      tbl.string('mime_type');
      tbl.integer('size');
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
