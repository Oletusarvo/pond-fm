const tablename = 'user_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .withSchema('auth')
    .raw("CREATE TYPE auth.user_status AS ENUM ('pending_verification', 'pending_review', 'active', 'suspended', 'deleted')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.specificType('status', 'auth.user_status').notNullable().defaultTo('pending_verification');
      tbl.string('email').notNullable().unique();
      tbl.string('username').unique();
      tbl.timestamp('terms_accepted_at').defaultTo(knex.fn.now());
      tbl.timestamp('deleted_at');
      tbl.timestamps(true, true);

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex
    .schema
    .withSchema('auth')
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS auth.user_status");
};
