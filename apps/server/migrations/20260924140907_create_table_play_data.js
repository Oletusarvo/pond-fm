const tablename = "play_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("post").createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .string("track_id")
      .notNullable()
      .references("audius_track_id")
      .inTable("post.track_data")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    tbl
      .string("user_id")
      .references("audius_user_id")
      .inTable("auth.user_data")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    tbl.timestamp("play_counted_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropTableIfExists(tablename);
};
