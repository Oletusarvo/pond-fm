const tablename = 'upload_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .withSchema('upload')
    .alterTable(tablename, tbl => {
      tbl.string('key');
    })
    .then(async () => {
      await knex(`upload.${tablename}`).update({
        key: knex.raw("CONCAT('uploads/', filename)")
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('upload').alterTable(tablename, tbl => tbl.dropColumn('key'));
};
