import { userService } from '../container';
import { AuthRepository } from '../repositories/auth-repository';
import { Repository } from '../repositories/repository';
import { DBContext } from '../types/db-context';
import { createJWT } from '../utils/jwt';
import crypto from 'crypto';
import { ServiceResponse, ServiceSuccessResponse } from '../types/service-response';
import { serviceError } from '../utils/service-error';
import { findValidTokenByCode } from '../DAL/auth/find-token-by-code';
import { UserRepository } from '../repositories/user-repository';
import { activateUserById } from '../DAL/users/activate-by-id';

export class AuthService {
  constructor(private repos: {
    userRepo: UserRepository,
    authRepo: AuthRepository,
  }) {
    this.repos = repos;
  }

  /**Authorizes a user by an auth code.Also activates the user if they haven't already been.
   * @returns A JWT-token encoding the authorized user's data.
   */
  async authorizeUserByCode(ctx: DBContext, config: Parameters<typeof findValidTokenByCode>[1]): Promise<ServiceResponse<string>> {
    const authToken = await this.repos.authRepo.findValidTokenByCode(ctx, config);
    if (!authToken) {
      return {
        success: false,
        error: serviceError.auth.unauthorized,
      };
    } else {
      await this.repos.authRepo.deleteAuthTokenById(ctx, { id: authToken.id });
    }

    const savedUser = await this.repos.userRepo.findByEmail(ctx, { user: { email: authToken.user_email } });
    if (savedUser.status === 'pending') {
      await this.repos.userRepo.activateById(ctx, { user: { id: savedUser.id } });
    }

    const token = createJWT(
      { user: savedUser },
      {
        expiresIn: '90d',
      },
    );

    return {
      success: true,
      data: token,
    };
  }

  /**Creates an authorization code. */
  async createAuthorizationCode(ctx: DBContext, config: { user: { id: string } }) {
    const code = crypto.randomBytes(32).toString('base64url');
    const expires_at = new Date(Date.now() + 1000 * 60 * 15);
    await this.repos.authRepo.createAuthToken(ctx, { code, user_id: config.user.id, expires_at });
    return {
      success: true,
      data: code,
    } as ServiceSuccessResponse<string>;
  }
}
