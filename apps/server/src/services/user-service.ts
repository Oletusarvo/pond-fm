import { Knex } from 'knex';
import { db } from '../db-config';
import { UserRepository } from '../repositories/user-repository';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { ServiceResponse, ServiceSuccessResponse } from '../types/service-response';
import crypto from 'crypto';

export class UserService {
  constructor(private repo: UserRepository) {}
  async findById(id: string, ctx: DBContext) {
    const data = await this.repo.findById(id, ctx);
    return { success: true, data } as ServiceSuccessResponse;
  }

  async activateById(userId: string, ctx: DBContext) {
    await this.repo.activateById(userId, ctx);
    return {
      success: true,
    } as ServiceSuccessResponse;
  }

  async createIfNotExists(payload: { email: string }, ctx: DBContext) {
    let user = await this.repo.findByEmail(payload.email, ctx);
    if (!user) {
      //Create a new pending user record.
      const defaultUserId = crypto.randomBytes(8).toString('hex');
      const userNumber = BigInt('0x' + defaultUserId).toString();
      const defaultUserName = `user-${userNumber}`;

      [user] = await this.repo
        .create(
          {
            email: payload.email,
            username: defaultUserName,
            user_status_id: db
              .select('id')
              .from(tablenames.userStatuses)
              .where({ label: 'pending' })
              .limit(1),
          },
          ctx,
        )
        .returning('id');
    }
    return { success: true, data: user } as ServiceSuccessResponse<{ id: string }>;
  }

  async create(payload: any, ctx: DBContext) {
    await this.repo.create(payload, ctx);
    return { success: true } as ServiceSuccessResponse<void>;
  }
  /**
   * Authenticates a user by their credentials.
   *
   * @param credentials
   * @param ctx
   * @returns
   * @deprecated Use AuthService.authenticateUserByEmail instead.
   */
  async authenticate(credentials: any, ctx: DBContext) {
    const savedUser = await this.repo.findByEmail(credentials.email, ctx);

    return {
      user: savedUser,
      result: 'ok',
    };
  }

  async findByEmail(email: string, ctx: DBContext) {
    const data = await this.repo.findByEmail(email, ctx);
    return { success: true, data } as ServiceSuccessResponse<any>;
  }

  async updateUserTags(
    payload: {
      userId: string;
      tags: string[];
    },
    ctx: Knex.Transaction,
  ) {
    await this.repo.updateUserTags(payload, ctx);
    return { success: true } as ServiceSuccessResponse;
  }
}
