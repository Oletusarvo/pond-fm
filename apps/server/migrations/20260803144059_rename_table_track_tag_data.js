const tablename = {
  new: 'track_mood_data',
  old: 'track_tag_data'
}

const column = {
  old: 'tag_id',
  new: 'mood_type_id'
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .renameTable(tablename.old, tablename.new)
    .alterTable(tablename.new, tbl => {
      tbl.renameColumn(column.old, column.new);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.renameTable(tablename.new, tablename.old).alterTable(tablename.old, tbl => {
    tbl.renameColumn(column.new, column.old)
  })
};
