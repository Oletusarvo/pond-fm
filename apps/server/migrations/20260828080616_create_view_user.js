const viewname = "user_view";
const { constructUserViewV1 } = require("../migration-utils/views/user-view");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("auth")
    .createViewOrReplace(viewname, (view) => constructUserViewV1(knex, view));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("auth").dropViewIfExists(viewname);
};
