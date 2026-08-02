const tablename = 'unique_listener_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('track_id')
      .references('id')
      .inTable('track_data')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .uuid('user_id')
      .references('id')
      .inTable('user_data')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl.uuid('session_id').notNullable();
    tbl.timestamp('created_at').defaultTo(knex.fn.now());
    tbl.unique(['track_id', 'user_id']);
    tbl.unique(['track_id', 'session_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
