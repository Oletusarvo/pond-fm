const createLookupTable = require('../migration-utils/create-lookup-table');
const tablename = 'notification_data';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw("CREATE TYPE notification_type AS ENUM ('like', 'repost', 'follow', 'comment')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('recipient_id')
        .notNullable()
        .references('id')
        .inTable('auth.user_data')
        .onDelete('CASCADE');
      tbl.uuid('sender_id').references('id').inTable('auth.user_data').onDelete('CASCADE');
      tbl.uuid('track_id').references('id').inTable('post.track_data').onDelete('CASCADE');
      tbl
        .specificType('type', 'notification_type').notNullable();
      tbl.timestamp('created_at').defaultTo(knex.fn.now());
      tbl.timestamp('seen_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS notification_type");
};
