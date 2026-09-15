const { constructUserViewV2 } = require("../migration-utils/views/user-view");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("auth")
    .createViewOrReplace("user_view", (view) =>
      constructUserViewV2(knex, view),
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
