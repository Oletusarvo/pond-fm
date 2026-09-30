const tablename = "post_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("post")
    .raw(
      "CREATE TYPE post.post_status AS ENUM ('active', 'pending_review', 'pending_deletion', 'deleted')",
    )
    .createTable(tablename, (tbl) => {
      tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
      tbl
        .string("track_id")
        .references("audius_track_id")
        .inTable("post.track_data")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .string("author_id")
        .notNullable()
        .references("audius_user_id")
        .inTable("auth.user_data")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      tbl.timestamps(true, true);
      tbl.unique(["author_id", "track_id"]);
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
    .raw("DROP TYPE IF EXISTS post.post_status");
};
