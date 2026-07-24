import { Knex } from 'knex';
import { DBContext } from '../types/db-context';

export abstract class Repository<TData> {
  constructor(
    protected tablename: string,
    protected baseQuery: (tablename: string, ctx: DBContext) => Knex.QueryBuilder,
  ) {}

  findById(id: string, ctx: DBContext) {
    return this.baseQuery(this.tablename, ctx).where({ id });
  }

  create(data: Record<string, any>, ctx: DBContext) {
    return ctx(this.tablename).insert(data);
  }
}
