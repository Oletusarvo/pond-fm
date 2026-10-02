const tablename = "track_like_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("post").createTable(tablename, (tbl) => {
    tbl
      .string("track_id")
      .references("id")
      .inTable("post.track_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .string("user_id")
      .references("id")
      .inTable("auth.user_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
    tbl.primary(["track_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropTableIfExists(tablename);
};
