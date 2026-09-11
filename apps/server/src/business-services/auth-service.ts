import { AuthRepository } from "../repositories/auth-repository";
import { DBContext } from "../types/db-context";
import { createJWT } from "@pondfm/server-utils";
import crypto from "crypto";
import { ServiceSuccessResponse } from "../types/service-response";
import { findValidTokenByCode } from "../DAL/auth/find-token-by-code";
import { UserRepository } from "../repositories/user-repository";
import { serviceError } from "../utils/service-error";
import { tablenames } from "../tablenames";
import { TUser } from "@pondfm/app-shared";

/**@deprecated */
export class AuthService {
  constructor(
    private repos: {
      users: UserRepository;
      auth: AuthRepository;
    },
  ) {
    this.repos = repos;
  }

  /**Authorizes a user by an auth code and deletes the code.
   * @returns A JWT-token encoding the authorized user's data.
   * @deprecated
   */
  async authorizeUserByCode(
    ctx: DBContext,
    config: Parameters<typeof findValidTokenByCode>[1],
  ) {
    const authToken = await this.repos.auth.findValidTokenByCode(ctx, config);
    if (!authToken) {
      return {
        success: false,
        error: serviceError.auth.unauthorized,
      };
    } else {
      await this.repos.auth.deleteAuthTokenById(ctx, { id: authToken.id });
      return {
        success: true,
        data: authToken,
      };
    }
  }
  /**@deprecated */
  async createSessionToken(
    ctx: DBContext,
    config: { authToken: { user_email: TUser["email"] } },
  ) {
    const savedUser = await this.repos.users.findByEmail(ctx, {
      email: config.authToken.user_email,
    });
    if (savedUser.status === "pending_verification") {
      await ctx(tablenames.users)
        .where({ id: savedUser.id, status: "pending_verification" } as TUser)
        .update({
          status: "active",
        } as TUser);
    }

    const token = createJWT(
      { user: savedUser },
      {
        expiresIn: "90d",
      },
    );

    return {
      success: true,
      data: token,
    };
  }

  /**Creates an authorization code. */
  async createAuthorizationCode(ctx: DBContext, config: { userId: string }) {
    const code = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await this.repos.auth.createAuthToken(ctx, {
      code,
      userId: config.userId,
      expiresAt,
    });
    return {
      success: true,
      data: code,
    } as ServiceSuccessResponse<string>;
  }
}
