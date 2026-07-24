const tablename = 'track_like_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('track_id').references('id').inTable('track_data').onDelete('CASCADE');
    tbl.uuid('user_id').references('id').inTable('user_data').onDelete('CASCADE');
    tbl.primary(['track_id', 'user_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
