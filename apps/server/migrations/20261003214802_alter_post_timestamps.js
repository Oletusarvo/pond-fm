const constructTrackView = require("../migration-utils/views/track-view.js");
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .withSchema("post")
    .dropViewIfExists("track_view")
    .alterTable("post_data", (tbl) => {
      tbl.timestamp("created_at", { precision: 3 }).alter();
      tbl.timestamp("updated_at", { precision: 3 }).alter();
    })
    .createView("track_view", (view) => constructTrackView(knex, view));
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
