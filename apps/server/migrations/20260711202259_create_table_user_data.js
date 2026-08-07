const tablename = 'user_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .withSchema('auth')
    .raw("CREATE TYPE auth.user_status AS ENUM ('pending', 'active', 'suspended', 'deleted')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl.specificType('status', 'auth.user_status').notNullable().defaultTo('pending');
      tbl.string('email').notNullable().unique();
      tbl.string('username').unique();
      tbl.timestamps(true, true);
      tbl.timestamp('terms_accepted_at').defaultTo(knex.fn.now());
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
