const createLookupTable = require('../migration-utils/create-lookup-table');

const tablename = 'user_status';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, createLookupTable).then(async () => {
    await knex(tablename).insert([
      { label: 'active' },
      { label: 'pending' },
      { label: 'suspended' },
      { label: 'deleted' },
    ]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
