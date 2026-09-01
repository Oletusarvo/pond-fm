/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('billing').alterTable('subscription_data', tbl => {
    tbl.string('stripe_payment_intent_id');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').alterTable('subscription_data', tbl => {
    tbl.dropColumn('stripe_payment_intent_id');
  })
};
