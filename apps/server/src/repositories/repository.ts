import { Knex } from 'knex';
import { DBContext } from '../types/db-context';

export abstract class Repository<TTable extends { data: string } & Record<string, string>> {
  constructor(
    protected tablename: TTable,
    protected baseQuery: (ctx: DBContext) => Knex.QueryBuilder,
  ) {}

  deleteById(id: string, ctx: DBContext) {
    return ctx(this.tablename).where({ id }).del();
  }

  findById(id: string, ctx: DBContext) {
    return this.baseQuery(ctx).where({ id }).first();
  }

  findMany(cursor: Record<string, any> | null, ctx: DBContext) {
    const query = this.baseQuery(ctx);
    if (cursor) {
      query
        .whereRaw('post.created_at < ?', [cursor.timestamp])
        .andWhereNot({ 'post.id': cursor.id });
    }
    return query;
  }

  create(payload: Record<string, any>, ctx: DBContext) {
    return ctx(this.tablename.data).insert(payload);
  }

  getBaseQuery(ctx: DBContext) {
    return this.baseQuery(ctx);
  }
}
