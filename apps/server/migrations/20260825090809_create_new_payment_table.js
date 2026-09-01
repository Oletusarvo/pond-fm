const tablename = 'payment_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('billing').createTable(tablename, tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl.uuid('subscription_user_id').notNullable().references('user_id').inTable('billing.subscription_data').onDelete('CASCADE').onUpdate('CASCADE');
    tbl.string('stripe_payment_intent_id').unique().notNullable();
    tbl.string('stripe_invoice_id').unique().notNullable();
    tbl.bigint('amount_in_decimal').notNullable();
    tbl.timestamp('paid_at').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').dropTableIfExists(tablename);
};
