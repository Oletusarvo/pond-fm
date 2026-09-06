import { extractJsonBody } from "../extract-json-body";
import { joinStrings } from "../join-strings";
import { AuthApi } from "./auth/auth-api";
import { TracksApi } from "./tracks/tracks-api";
import { TApiResponse } from "./types";
import { UsersApi } from "./users/users-api";

export class Api {
  private static endpoint: string = import.meta.env.DEV
    ? "http://localhost:3002/api/v1"
    : "https://pond-fm-api.onrender.com/api/v1";

  static withEndpoint(...args: string[]) {
    return joinStrings([this.endpoint, ...args], "/");
  }

  static async asApiResponse<T = unknown, E = unknown>(
    res: Response,
  ): Promise<TApiResponse<T, E>> {
    return res.ok
      ? {
          status: res.status,
          success: true,
          data: await extractJsonBody(res),
        }
      : {
          status: res.status,
          success: false,
          error: await extractJsonBody(res),
        };
  }

  /**Provides authorization-related methods. */
  auth = new AuthApi();
  /**Provides methods related to users. */
  users = new UsersApi();
  /**Provides methods related to tracks. */
  tracks = new TracksApi();
}

export const api = new Api();
