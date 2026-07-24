const createLookupTable = require('../migration-utils/create-lookup-table');

const tablename = 'tag_data';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable(tablename, createLookupTable).then(async () => {
    await knex(tablename).insert([
      { label: 'Alternative' },
      { label: 'Ambient' },
      { label: 'Blues' },
      { label: "Children's Music" },
      { label: 'Classical' },
      { label: 'Comedy' },
      { label: 'Country' },
      { label: 'Dance' },
      { label: 'Disco' },
      { label: 'Drum & Bass' },
      { label: 'Dub' },
      { label: 'Dubstep' },
      { label: 'EDM' },
      { label: 'Electronic' },
      { label: 'Experimental' },
      { label: 'Folk' },
      { label: 'Funk' },
      { label: 'Gospel' },
      { label: 'Grime' },
      { label: 'Hip Hop' },
      { label: 'House' },
      { label: 'Indie' },
      { label: 'Industrial' },
      { label: 'Instrumental' },
      { label: 'Jazz' },
      { label: 'K-Pop' },
      { label: 'Latin' },
      { label: 'Lo-Fi' },
      { label: 'Metal' },
      { label: 'New Age' },
      { label: 'Opera' },
      { label: 'Pop' },
      { label: 'Punk' },
      { label: 'R&B' },
      { label: 'Rap' },
      { label: 'Reggae' },
      { label: 'Rock' },
      { label: 'Shoegaze' },
      { label: 'Singer-Songwriter' },
      { label: 'Ska' },
      { label: 'Soul' },
      { label: 'Soundtrack' },
      { label: 'Techno' },
      { label: 'Trance' },
      { label: 'Trap' },
      { label: 'World' },
    ]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists(tablename);
};
