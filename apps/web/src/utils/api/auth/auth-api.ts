import { errorValues, TSession } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TApiResponse } from "../types";
import { serviceError } from "@pondfm/app-shared";
export class AuthApi {
  /**Requests a login magic link. */
  async requestAuthorization(credentials: {
    email: string;
    username?: string;
  }) {
    const req = requestBuilder
      .post()
      .body(credentials)
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(
      Api.withEndpoint("auth/request-authorization"),
      req,
    );
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.userQuotaExceeded
    >(res);
  }

  /**Authorizes a user using the auth code obtained after calling login. */
  async authorize(code: string) {
    const req = requestBuilder
      .post()
      .body({ code })
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("auth/authorize"), req);
    return await Api.asApiResponse<null, typeof serviceError.auth.unauthorized>(
      res,
    );
  }

  /**Returns the session info of an authenticated user */
  async me() {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("auth/me"), req);
    return await Api.asApiResponse<
      TSession,
      typeof serviceError.auth.unauthorized
    >(res);
  }

  /**Logs the user out. */
  async logout() {
    const req = requestBuilder.post().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("auth/logout"), req);
    return await Api.asApiResponse<null, typeof serviceError.auth.unauthorized>(
      res,
    );
  }

  /**Refreshes the users session. */
  async refreshSession(newSession: Partial<TSession>) {
    const req = requestBuilder
      .post()
      .json()
      .body(newSession)
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("auth/me/refresh"), req);
    return await Api.asApiResponse<null, typeof serviceError.auth.unauthorized>(
      res,
    );
  }
}
