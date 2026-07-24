import knex from 'knex';
import knexfile from '../knexfile';
const env = process.env.DB_ENVIRONMENT || 'development';
export const db = knex(knexfile[env]);
