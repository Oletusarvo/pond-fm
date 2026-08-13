import { serverConfig } from '../../../../server-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Logs a user out by clearing their session cookie. */
export const logoutHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  return res.clearCookie(serverConfig.accessTokenName, serverConfig.sessionCookieSettings).end();
});
