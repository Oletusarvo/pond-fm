const tablename = 'subscription_quota_override_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('billing')
    .createTable(tablename, tbl => {
      tbl.uuid('user_id').primary()
        .references('user_id')
        .inTable('billing.subscription_data')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl.bigint('storage_quota_bytes').notNullable();
      tbl.integer('unique_listeners_threshold');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').dropTableIfExists(tablename);
};
