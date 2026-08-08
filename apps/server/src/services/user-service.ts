import { Knex } from 'knex';
import { db } from '../db-config';
import { UserRepository } from '../repositories/user-repository';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { ServiceResponse, ServiceSuccessResponse } from '../types/service-response';
import crypto from 'crypto';
import { findUserByEmail } from '../DAL/users/find-user-by-email';

export class UserService {
  constructor(private repo: UserRepository) { }

  async createIfNotExists(ctx: DBContext, config: Parameters<typeof findUserByEmail>[1]) {
    let user = await this.repo.findByEmail(ctx, config);
    if (!user) {
      //Create a new pending user record.
      const defaultUserId = crypto.randomBytes(8).toString('hex');
      const userNumber = BigInt('0x' + defaultUserId).toString();
      const defaultUserName = `user-${userNumber}`;
      user = await this.repo.createNewUser(ctx, { user: { email: config.user.email, username: defaultUserName } });
    }

    return { success: true, data: user } as ServiceSuccessResponse<{ id: string }>;
  }
}
