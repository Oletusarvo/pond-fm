const tablename = 'follower_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, tbl => {
    tbl.uuid('follower_id').references('id').inTable('auth.user_data').onUpdate('CASCADE').onDelete('CASCADE');
    tbl.uuid('followee_id').references('id').inTable('auth.user_data').onUpdate('CASCADE').onDelete('CASCADE');
    tbl.primary(['follower_id', 'followee_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
