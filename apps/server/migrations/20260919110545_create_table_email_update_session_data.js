const tablename = "email_reset_session_data";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("auth").createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .string("user_id")
      .unique()
      .notNullable()
      .references("audius_user_id")
      .inTable("auth.user_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.boolean("is_used").defaultTo(false);
    tbl.string("new_email").notNullable();
    tbl.timestamp("expires_at").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("auth").dropTableIfExists(tablename);
};
