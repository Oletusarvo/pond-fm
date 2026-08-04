const createLookupTable = require('../migration-utils/create-lookup-table');
const tablename = {
  new: 'mood_type',
  old: 'tag_data',
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .renameTable(tablename.old, tablename.new)
    .then(async () => {
      await knex(tablename.new).del();
      await knex(tablename.new).insert()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.renameTable(tablename.new, tablename.old);
};
