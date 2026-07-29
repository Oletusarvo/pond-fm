/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('post_data', tbl => {
    tbl.dropColumn('post_status_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('post_data', tbl => {
    tbl.integer('post_status_id').references('id').inTable('content_status');
  });
};
