const constructTrackView = require("../migration-utils/views/track-view.js");
const viewname = "track_view";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("post")
    .dropViewIfExists(viewname)
    .createView(viewname, (view) => constructTrackView(knex, view));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.withSchema("post").dropViewIfExists(viewname);
};
