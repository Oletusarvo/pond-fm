const tablename = 'post_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .withSchema('post')
    .raw("CREATE TYPE post.post_status AS ENUM ('active', 'pending_review', 'deleted')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('author_id')
        .notNullable()
        .references('id')
        .inTable('auth.user_data')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      tbl
        .uuid('track_id')
        .references('id')
        .inTable('post.track_data')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');

      tbl.specificType('status', 'post.post_status').notNullable().defaultTo('active')
      tbl.string('body');
      tbl.timestamps(true, true);
      tbl.unique(['author_id', 'track_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema('post')
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS post.post_status");
};
