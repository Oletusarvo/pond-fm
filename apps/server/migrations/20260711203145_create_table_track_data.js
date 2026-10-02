const tablename = "track_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("post")
    .raw("CREATE TYPE post.track_status AS ENUM ('active', 'deleted', 'pending_review')")
    .createTable(tablename, (tbl) => {
      tbl.string("id").primary().comment("The audius track id.");
      tbl
        .string("author_id")
        .notNullable()
        .references("id")
        .inTable("auth.user_data")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      tbl.specificType("status", "post.track_status").defaultTo("active");
      tbl.integer("genre_id").notNullable().references("id").inTable("post.genre_type");
      tbl.bigint("play_count").defaultTo(0);
      tbl.bigint("unique_play_count").defaultTo(0);
      tbl.timestamp("deleted_at");
      tbl.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("post")
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS post.track_status");
};
