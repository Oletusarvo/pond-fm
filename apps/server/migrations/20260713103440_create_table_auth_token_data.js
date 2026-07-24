const tablename = 'auth_token_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('user_id')
      .unique()
      .notNullable()
      .references('id')
      .inTable('user_data')
      .onDelete('CASCADE');
    tbl.string('code').notNullable().unique();
    tbl.boolean('is_used').defaultTo(false);
    tbl.timestamp('expires_at').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
