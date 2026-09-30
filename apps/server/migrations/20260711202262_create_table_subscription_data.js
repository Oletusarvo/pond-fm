const tablename = "subscription_data";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("billing")
    .raw(
      "CREATE TYPE billing.subscription_status AS ENUM ('trialing', 'active','incomplete','incomplete_expired','past_due','unpaid','canceled','paused')",
    )
    .createTable(tablename, (tbl) => {
      tbl
        .string("user_id")
        .primary()
        .references("audius_user_id")
        .inTable("auth.user_data")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .string("plan_id")
        .notNullable()
        .references("id")
        .inTable("billing.plan_data")
        .onUpdate("CASCADE");
      tbl.specificType("status", "billing.subscription_status").defaultTo("incomplete");
      tbl.string("stripe_subscription_id").unique();
      tbl.string("stripe_customer_id").unique();
      tbl.boolean("cancel_at_period_end").defaultTo(false);
      tbl.timestamp("canceled_at");
      tbl.timestamp("current_period_start");
      tbl.timestamp("current_period_end");
      tbl.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .withSchema("billing")
    .dropTableIfExists(tablename)
    .raw("DROP TYPE IF EXISTS billing.subscription_status");
};
