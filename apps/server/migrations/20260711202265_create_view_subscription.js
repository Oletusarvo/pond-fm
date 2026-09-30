const viewname = "subscription_view";
const constructSubscriptionView = require("../migration-utils/views/subscription-view");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("billing")
    .createViewOrReplace(viewname, (view) => constructSubscriptionView(knex, view));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("billing").dropViewIfExists(viewname);
};
