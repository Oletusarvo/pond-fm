const tablename = 'track_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex
    .schema
    .withSchema('post')
    .raw("CREATE TYPE post.track_status AS ENUM ('active', 'pending_review')")
    .createTable(tablename, tbl => {
      tbl.uuid('id').primary().defaultTo(knex.fn.uuid());
      tbl
        .uuid('author_id')
        .notNullable()
        .references('id')
        .inTable('auth.user_data')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.uuid('primary_audio_id').notNullable().references('upload_id').inTable('upload.audio_data').onDelete('SET NULL');

      tbl.specificType('status', 'post.track_status').notNullable();
      tbl.string('title').notNullable();
      tbl.string('description');
      tbl.integer('genre_id').notNullable().references('id').inTable('post.genre_type');
      tbl.integer('play_count').defaultTo(0);
      tbl.integer('unique_play_count').defaultTo(0);
      tbl.timestamps(true, true);
      tbl.unique(['author_id', 'title']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema('post').dropTableIfExists(tablename).raw("DROP TYPE IF EXISTS post.track_status");
};
