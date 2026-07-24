const tablename = 'track_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('user_data')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    tbl.integer('track_status_id').notNullable().references('id').inTable('content_status');
    tbl.string('title').notNullable();
    tbl.string('description');
    tbl.string('filename').notNullable();
    tbl.integer('play_count').defaultTo(0);
    tbl.timestamps(true, true);
    tbl.unique(['user_id', 'title']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
