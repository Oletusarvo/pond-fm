/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex('genre_type').insert(
    [
      { label: 'electronic' },
      { label: 'house' },
      { label: 'techno' },
      { label: 'trance' },
      { label: 'drum & bass' },
      { label: 'hip hop' },
      { label: 'pop' },
      { label: 'rock' },
      { label: 'metal' },
      { label: 'punk' },
      { label: 'folk' },
      { label: 'country' },
      { label: 'jazz' },
      { label: 'blues' },
      { label: 'soul' },
      { label: 'funk' },
      { label: 'r&b' },
      { label: 'reggae' },
      { label: 'ambient' },
      { label: 'classical' },
    ]
  )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex('genre_type').del()
};
