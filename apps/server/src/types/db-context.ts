import { Knex } from 'knex';

export type DBContext<T = any, K = any> = Knex<T, K> | Knex.Transaction<T, K>;
