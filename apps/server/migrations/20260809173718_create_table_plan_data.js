const tablename = {
  plans: 'plan_data',
  subscriptions: 'subscription_data',
  subscription_quota_overrides: 'subscription_quota_override_data',
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createSchema('billing')
    .withSchema('billing')
    .createTable(tablename.plans, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.string('label').unique().notNullable();
      tbl.integer('storage_quota_mib');
      tbl.timestamps(true, true);
    })
    .createTable(tablename.subscriptions, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.uuid('plan_id').notNullable().references('id').inTable(`billing.${tablename.plans}`).onUpdate('CASCADE')
      tbl.uuid('user_id').notNullable().references('id').inTable('auth.user_data').onDelete('CASCADE').onUpdate('CASCADE');
      tbl.unique('user_id');
      tbl.timestamps(true, true);
    })
    .createTable(tablename.subscription_quota_overrides, tbl => {
      tbl.uuid('subscription_id').primary().notNullable().references('id').inTable(`billing.${tablename.subscriptions}`).onDelete('CASCADE').onUpdate('CASCADE');
      tbl.integer('storage_quota_mib').notNullable();
    })
    .then(async () => {
      await knex(`billing.${tablename.plans}`).insert([
        { label: 'free', storage_quota_mib: 20 * 1024 * 1024 },
        { label: 'pro', storage_quota_mib: null }
      ]);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('billing')
    .dropTableIfExists(tablename.subscription_quota_overrides)
    .dropTableIfExists(tablename.subscriptions)
    .dropTableIfExists(tablename.plans)
    .dropSchemaIfExists('billing');
};
