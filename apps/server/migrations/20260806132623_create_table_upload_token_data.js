const tablename = 'upload_token_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema('upload').createTable(tablename, tbl => {
    tbl.uuid('upload_id').references('id').inTable('upload.upload_data').onDelete('CASCADE');
    tbl.uuid('user_id').references('id').inTable('auth.user_data').onDelete('CASCADE');
    tbl.string('code').notNullable();
    tbl.bigint('expires_at').notNullable();
    tbl.primary(['upload_id', 'user_id']);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('upload').dropTableIfExists(tablename);
};
