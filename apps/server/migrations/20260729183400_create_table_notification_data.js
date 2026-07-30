const createLookupTable = require('../migration-utils/create-lookup-table');
const tablename = 'notification_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('notification_type', createLookupTable)
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('recipient_id')
        .notNullable()
        .references('id')
        .inTable('user_data')
        .onDelete('CASCADE');
      tbl.uuid('sender_id').references('id').inTable('user_data').onDelete('CASCADE');
      tbl.uuid('track_id').references('id').inTable('track_data').onDelete('CASCADE');
      tbl
        .integer('notification_type_id')
        .references('id')
        .inTable('notification_type')
        .onUpdate('CASCADE');
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('seen_at');
    })
    .then(async () => {
      await knex('notification_type').insert([{ label: 'like' }, { label: 'repost' }]);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename).dropTableIfExists('notification_type');
};
