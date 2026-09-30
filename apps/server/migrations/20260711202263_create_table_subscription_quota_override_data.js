const tablename = "subscription_quota_override_data";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.withSchema("billing").createTable(tablename, (tbl) => {
    tbl
      .string("user_id")
      .primary()
      .references("user_id")
      .inTable("billing.subscription_data")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    tbl.integer("unique_listeners_threshold");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("billing").dropTableIfExists(tablename);
};
