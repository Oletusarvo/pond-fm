const tablename = 'plan_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('billing')
    .createTable(tablename, tbl => {
      tbl.string('id').primary();
      tbl.string('stripe_price_id').unique();
      tbl.integer('unique_listeners_threshold').defaultTo(25);
      tbl.bigint('storage_quota_bytes');
      tbl.bigint('price_in_cents').defaultTo(0).comment('The price in cents defined in the stripe price. For display only.');
      tbl.timestamps(true, true);
    })
    .then(async () => {
      await knex(`billing.${tablename}`).insert([
        { id: 'free', storage_quota_bytes: 150 * 1024 ** 2 },
        { id: 'pro', storage_quota_bytes: 5 * 1024 ** 3 }
      ]);
    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('billing').dropTableIfExists(tablename);
};
