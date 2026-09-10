import { createHandler } from "@pondfm/server-utils";
import { serverConfig } from "../../../../server-config";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Logs a user out by clearing their session cookie. */
export const logoutHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    return res
      .clearCookie(
        serverConfig.accessTokenName,
        serverConfig.sessionCookieSettings,
      )
      .end();
  },
);
