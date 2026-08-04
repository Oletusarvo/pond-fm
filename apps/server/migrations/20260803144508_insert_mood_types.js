/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.transaction(async trx => {
    await trx('mood_type').del();
    await trx('mood_type').insert([
      { label: 'happy' },
      { label: 'sad' },
      { label: 'melancholic' },
      { label: 'moody' },
      { label: 'dark' },
      { label: 'ominous' },
      { label: 'aggressive' },
      { label: 'tense' },
      { label: 'energetic' },
      { label: 'euphoric' },
      { label: 'peaceful' },
      { label: 'dreamy' },
      { label: 'ethereal' },
      { label: 'psychedelic' },
      { label: 'hypnotic' },
      { label: 'nostalgic' },
      { label: 'romantic' },
      { label: 'mysterious' },
      { label: 'uplifting' },
      { label: 'playful' },
    ])
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.resolve();
};
