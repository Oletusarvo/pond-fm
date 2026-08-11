import { serverConfig } from '../../../../../server-config';
import { authService, userService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

/**Authorizes a user by their auth code, returning the session token as a cookie and as part of the response body. */
export const authorizeByCodeHandler = createHandler(async (req, res) => {
  const { code } = req.body;
  return await db.transaction(async trx => {
    const authResult = await authService.authorizeUserByCode(trx, { code });
    if (authResult.success === false) {
      console.log(authResult.error);
      return res.status(401).end();
    }

    const sessionTokenResult = await authService.createSessionToken(trx, { authToken: authResult.data });
    return res
      .cookie(serverConfig.accessTokenName, sessionTokenResult.data, serverConfig.sessionCookieSettings).end();
  });
});
