import { userService } from '../container';
import { AuthRepository } from '../repositories/auth-repository';
import { Repository } from '../repositories/repository';
import { DBContext } from '../types/db-context';
import { createJWT } from '../utils/jwt';
import crypto from 'crypto';
import { ServiceResponse, ServiceSuccessResponse } from '../types/service-response';
import { serviceError } from '../utils/service-error';

export class AuthService {
  constructor(private repo: AuthRepository) {
    this.repo = repo;
  }

  /**Authorizes a user by an auth code.
   * @returns A JWT-token encoding the authorized user's data.
   */
  async authorizeUserByCode(code: string, ctx: DBContext): Promise<ServiceResponse<string>> {
    const authToken = await this.repo.findTokenByCode(code, ctx);
    if (!authToken) {
      return {
        success: false,
        error: serviceError.auth.unauthorized,
      };
    } else {
      await this.repo.deleteById(authToken.id, ctx);
    }

    const savedUser = await userService.findByEmail(authToken.user_email, ctx);
    if (savedUser.data.status === 'pending') {
      await userService.activateById(savedUser.data.id, ctx);
    }
    const token = createJWT(
      { user: savedUser.data },
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
  async createAuthorizationCode(user_id: string, ctx: DBContext) {
    const code = crypto.randomBytes(32).toString('base64url');
    const expires_at = new Date(Date.now() + 1000 * 60 * 15);
    await this.repo.createAuthToken(code, user_id, expires_at, ctx);
    return {
      success: true,
      data: code,
    } as ServiceSuccessResponse<string>;
  }
}
