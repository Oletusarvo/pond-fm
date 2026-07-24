import { Knex } from 'knex';
import { DBContext } from '../../types/db-context';

type BaseQueryFn = (tbl: string, ctx: DBContext) => Knex.QueryBuilder;

/**Base class for building repository-classes that abstract away query-logic.
 * @todo
 */
export abstract class Repo<DataT extends Record<string, any>> {
  protected baseQuery: BaseQueryFn;
  protected baseTablename: string;

  constructor(baseTablename: string, baseQuery: BaseQueryFn = (tbl, ctx) => ctx(tbl)) {
    this.baseTablename = baseTablename;
    this.baseQuery = baseQuery;
  }

  /**Creates a new record. */
  async create(data: DataT, ctx: DBContext) {
    await ctx(this.baseTablename).insert(data);
  }

  /**Finds a record by its id. */
  async findById(id: string, ctx: DBContext) {
    return await this.baseQuery(this.baseTablename, ctx).where({ id }).first();
  }

  /**Returns the raw knex query-builder calling baseQuery so it can be further chained. */
  getRawQuery(ctx: DBContext) {
    return this.baseQuery(this.baseTablename, ctx);
  }
}
