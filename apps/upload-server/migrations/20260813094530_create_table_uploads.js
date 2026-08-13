/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .raw("CREATE TYPE upload_status AS ENUM ('pending', 'processing', 'failed', 'ready')")
    .createTable('upload_data', tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.uuid('client_id').notNullable().references('id').inTable('client_data').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.specificType('status', 'upload_status').defaultTo('pending');
      tbl.string('key').notNullable().unique();
      tbl.string('mime_type').notNullable();
      tbl.bigint('size').notNullable();
      tbl.timestamps(true, true);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .raw("DROP TYPE IF EXISTS upload_status")
    .dropTableIfExists('upload_data');
};
