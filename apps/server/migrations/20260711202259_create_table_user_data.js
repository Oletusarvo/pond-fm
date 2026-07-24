const tablename = 'user_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl.integer('user_status_id').notNullable().references('id').inTable('user_status');
    tbl.string('email').notNullable().unique();
    tbl.string('username').notNullable();
    tbl.timestamps(true, true);
    tbl.timestamp('terms_accepted_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
