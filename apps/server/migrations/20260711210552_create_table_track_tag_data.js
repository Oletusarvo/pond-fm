const tablename = 'track_tag_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl
      .uuid('track_id')
      .notNullable()
      .references('id')
      .inTable('track_data')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl
      .integer('tag_id')
      .notNullable()
      .references('id')
      .inTable('tag_data')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    tbl.primary(['track_id', 'tag_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
