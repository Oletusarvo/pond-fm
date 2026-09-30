const tablename = "user_url_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("auth").createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .string("user_id")
      .notNullable()
      .references("audius_user_id")
      .inTable("auth.user_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.string("url").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.raw("DROP TABLE IF EXISTS auth.user_url_data CASCADE");
};
