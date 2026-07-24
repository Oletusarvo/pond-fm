import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { Repository } from './repository';

export class AuthRepository extends Repository<{ data: string }> {
  constructor() {
    super(
      {
        data: tablenames.authTokens,
      },
      ctx => {
        return ctx({ token: this.tablename.data }).join(
          { user: tablenames.users },
          'user.id',
          'token.user_id',
        );
      },
    );
  }

  /**Returns an unexpired and unused auth token by its code. */
  findTokenByCode(code: string, ctx: DBContext) {
    return this.baseQuery(ctx)
      .where({ code, is_used: false })
      .andWhereRaw('CURRENT_TIMESTAMP < expires_at')
      .select('token.id', 'user_id', 'user.email as user_email')
      .first();
  }

  /**Inserts a new authorization token, or replaces an existing one. */
  createAuthToken(code: string, user_id: string, expires_at: Date, ctx: DBContext) {
    return ctx(this.tablename.data)
      .insert({
        code,
        user_id,
        expires_at,
        is_used: false,
      })
      .onConflict(['user_id'])
      .merge();
  }
}
