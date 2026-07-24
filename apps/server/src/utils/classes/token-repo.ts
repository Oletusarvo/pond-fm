import { tablenames } from '../../tablenames';
import { DBContext } from '../../types/db-context';
import { Repo } from './repo';

class TokenRepo extends Repo<any> {
  constructor() {
    super(tablenames.currencyObjects, (tbl, ctx) => {
      return ctx({ token: tbl })
        .leftJoin(tablenames.denomTypes, 'denom_type.id', 'token.denom_type_id')
        .select(
          'token.id',
          'token.minted_on',
          ctx.raw('CAST(denom_type.value_in_cents as INT) as value_in_cents'),
        );
    });
  }

  /**Returns the sum in cents of the tokens in circulation. */
  async getTokenCirculation(ctx: DBContext): Promise<number> {
    const result = await ctx({ token: this.baseTablename })
      .leftJoin('denom_type', 'denom_type.id', 'token.denom_type_id')
      .whereNotNull('token.account_id')
      .sum('denom_type.value_in_cents as circulation')
      .first();

    return result?.circulation ?? 0;
  }

  /**Returns the sum in cents of all accounts' balances */
  async getBalanceCirculation(ctx: DBContext) {
    const result = await ctx(tablenames.accounts).sum('balance_in_cents as circulation').first();
    return result?.circulation ?? 0;
  }

  /**Returns a knex-query builder pre-defined to include only reserve tokens. */
  getReserveTokensQuery(ctx: DBContext) {
    return this.getRawQuery(ctx)
      .whereNull('account_id')
      .orderBy('denom_type.value_in_cents', 'desc');
  }

  async getTokensOfUserById(userId: string, ctx: DBContext) {
    return await this.baseQuery(this.baseTablename, ctx).where({
      account_id: ctx.select('id').from(tablenames.accounts).where({ user_id: userId }).limit(1),
    });
  }
}

/**Singleton abstracting away query-logic for tokens. */
export const tokenRepo = new TokenRepo();
