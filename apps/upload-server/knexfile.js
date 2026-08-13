// Update with your config settings.
require('dotenv').config();
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      hostname: 'localhost',
      port: 5432,
      database: 'pondfm_upload_dev_db',
      user: 'dev_user',
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 0,
      max: 10,
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
