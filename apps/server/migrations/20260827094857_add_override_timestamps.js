/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('billing').alterTable(
    'subscription_quota_override_data',
    tbl => {
      tbl.timestamp('override_started_at').defaultTo(knex.fn.now());
      tbl.timestamp('override_expires_at');
    }
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').alterTable('subscription_quota_override_data', tbl => {
    tbl.dropColumn('override_started_at');
    tbl.dropColumn('override_expires_at');
  });
};
