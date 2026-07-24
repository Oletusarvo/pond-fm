import { Knex } from 'knex';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { Repository } from './repository';
import { db } from '../db-config';

export class UserRepository extends Repository<{ data: string; status: string; tags: string }> {
  constructor() {
    super(
      {
        data: tablenames.users,
        status: tablenames.userStatuses,
        tags: tablenames.userTags,
      },
      ctx => {
        return ctx({ user: this.tablename.data })
          .join({ user_status: this.tablename.status }, 'user.user_status_id', 'user_status.id')
          .select('user.id', 'user.email', 'user.username', 'user_status.label as status');
      },
    );
  }

  findById(id: string, ctx: DBContext) {
    return this.baseQuery(ctx).where({ 'user.id': id }).first();
  }

  findByEmail(email: string, ctx: DBContext) {
    return this.baseQuery(ctx).where({ email }).first();
  }

  activateById(userId: string, ctx: DBContext) {
    return ctx(this.tablename)
      .where({ id: userId })
      .update({
        user_status_id: db
          .select('id')
          .from(this.tablename.status)
          .where({ label: 'active' })
          .limit(1),
      });
  }

  /**Creates or updates the tags of a user. */
  async updateUserTags(payload: { userId: string; tags: string[] }, trx: Knex.Transaction) {
    await trx(this.tablename.tags).where({ user_id: payload.userId }).del();
    await trx(this.tablename.tags).insert(
      payload.tags.map(tag => {
        return {
          user_id: payload.userId,
          tag_id: db.select('id').from(tablenames.tags).where({ label: tag }).limit(1),
        };
      }),
    );
  }
}
