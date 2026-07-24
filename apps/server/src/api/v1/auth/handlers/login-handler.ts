import { serverConfig } from '../../../../../server-config';
import { userService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { createJWT } from '../../../../utils/jwt';
import crypto from 'crypto';

/**Logs a user in
 * @deprecated Use the createAuthTokenHandler and authorizeByCodeHandler instead.
 */
export const loginHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const { user, result } = await userService.authenticate(req.body, db);
  if (result !== 'ok') {
    return res.status(401).json({
      error: result,
    });
  }

  //Create a database entry with a temporary code.
  const code = crypto.randomBytes(32).toString('hex');
  const expires_at = new Date(Date.now() + 1000 * 60 * 15);
  await db('auth_token_data').insert({
    user_id: user.id,
    code,
    expires_at,
  });

  console.log('Temporary code log(remove once email is implemented): ', code);

  const token = createJWT(user);
  res.cookie(serverConfig.accessTokenName, token, {
    httpOnly: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 1000,
  });
  return res.json({ token }).end();
});
