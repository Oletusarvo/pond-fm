/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("auth").createTable("login_session_data", (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl.string("state").notNullable().unique();
    tbl.string("challenge").notNullable();
    tbl.string("verifier").notNullable();
    tbl.timestamp("expires_at").notNullable();
    tbl.boolean("is_used").defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("auth").dropTableIfExists("login_session_data");
};
