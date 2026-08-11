/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema('upload')
    .alterTable('upload_token_data', tbl => {
      tbl.dropColumn('expires_at');
    })
    .then(() =>
      knex.schema
        .withSchema('upload')
        .alterTable('upload_token_data', tbl => {
          tbl.timestamp('expires_at', { useTz: true });
        })
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('upload')
    .alterTable('upload_token_data', tbl => {
      tbl.dropColumn('expires_at');
    })
    .then(() =>
      knex.schema
        .withSchema('upload')
        .alterTable('upload_token_data', tbl => {
          tbl.bigint('expires_at');
        })
    );
};
