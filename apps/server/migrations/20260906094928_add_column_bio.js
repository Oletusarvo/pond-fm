const tablename = "user_data";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("auth").alterTable(tablename, (tbl) => {
    tbl.text("bio");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("auth").alterTable(tablename, (tbl) => {
    tbl.dropColumn("bio");
  });
};
