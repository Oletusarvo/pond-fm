const tablename = 'post_data';
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
      .notNullable()
      .references('id')
      .inTable('user_data')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl.integer('post_status_id').notNullable().references('id').inTable('content_status');
    tbl.string('body');
    tbl.timestamps(true, true);
    tbl.unique(['track_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
