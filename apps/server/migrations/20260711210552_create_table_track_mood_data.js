const tablename = "mood_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("post").createTable(tablename, (tbl) => {
    tbl
      .string("track_id")
      .notNullable()
      .references("audius_track_id")
      .inTable("post.track_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl
      .integer("mood_id")
      .notNullable()
      .references("id")
      .inTable("post.mood_type")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.primary(["track_id", "mood_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropTableIfExists(tablename);
};
