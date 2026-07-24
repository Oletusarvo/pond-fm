import { serverConfig } from '../../../../../server-config';
import { authService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

/**Authorizes a user by their auth code, returning the session token as a cookie and as part of the response body. */
export const authorizeByCodeHandler = createHandler(async (req, res) => {
  const { code } = req.body;
  const result = await authService.authorizeUserByCode(code, db);
  if (result.success === false) {
    return res.status(401).end();
  }

  return res
    .cookie(serverConfig.accessTokenName, result.data, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 90,
    })
    .json({
      token: result.data,
    });
});
