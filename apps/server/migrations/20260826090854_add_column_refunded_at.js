const tablename = 'payment_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('billing').alterTable(tablename, tbl => {
    tbl.timestamp('refunded_at');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').alterTable(tablename, tbl => {
    tbl.dropColumn('refunded_at');
  })
};
