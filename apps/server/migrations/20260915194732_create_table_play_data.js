const tablename = "play_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("post").createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .uuid("track_id")
      .notNullable()
      .references("id")
      .inTable("posts.track_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .uuid("user_id")
      .references("id")
      .inTable("auth.user_data")
      .onDelete("SET NULL")
      .onUpdate("CASCADE");
    tbl.uuid("session_id").notNullable();
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropTableIfExists(tablename);
};
