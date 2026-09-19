const tablename = "stream_session_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("post").createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid("user_id")
      .references("id")
      .inTable("auth.user_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.uuid("session_id").notNullable();
    tbl
      .uuid("track_id")
      .notNullable()
      .references("id")
      .inTable("post.track_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.boolean("is_used").defaultTo(false);
    tbl.timestamp("stream_started_at").defaultTo(knex.fn.now());
    tbl.timestamp("play_countable_at").notNullable();
    tbl.timestamp("expires_at").notNullable();
    tbl.unique(["session_id", "track_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropTableIfExists(tablename);
};
