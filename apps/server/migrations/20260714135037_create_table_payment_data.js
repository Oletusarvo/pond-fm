const tablename = "payment_data";
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, (tbl) => {
    tbl.uuid("id").primary().defaultTo(knex.fn.uuid());
    tbl
      .string("user_id")
      .references("audius_user_id")
      .inTable("auth.user_data")
      .onDelete("SET NULL");
    tbl
      .string("recipient_id")
      .references("audius_user_id")
      .inTable("auth.user_data")
      .comment("The receiving user when the payment is a tip.");
    tbl.string("currency").notNullable();
    tbl.integer("payment_status_id").notNullable().references("id").inTable("payment_status");
    tbl.integer("payment_type_id").notNullable().references("id").inTable("payment_type");
    tbl.bigint("amount_in_subunits").notNullable();
    tbl.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
