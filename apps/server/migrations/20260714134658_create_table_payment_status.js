const tablename = 'payment_status';
const createLookupTable = require('../migration-utils/create-lookup-table');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, createLookupTable).then(async () => {
    await knex(tablename).insert([
      { label: 'completed' },
      { label: 'pending' },
      { label: 'failed' },
      { label: 'processing' },
      { label: 'refunded' },
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
