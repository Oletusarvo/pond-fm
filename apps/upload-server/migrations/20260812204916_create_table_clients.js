/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('client_data', tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl.string('secret_key').notNullable();
    tbl.bigint('bytes_uploaded').defaultTo(0);
    tbl.bigint('bytes_streamed').defaultTo(0);
    tbl.timestamps(true, true);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('client_data');
};
