import { v4 } from 'uuid';
import { createHandler } from '../../../../utils/create-handler';
import { serverConfig } from '../../../../../server-config';
import { createJWT } from '../../../../utils/jwt';

export const createAnonymousSessionHandler = createHandler(async (req, res) => {
  const token = createJWT({ id: v4() });
  return res
    .cookie(
      serverConfig.anonymousSessionCookieName,
      token,
      serverConfig.anonymousSessionCookieSettings,
    )
    .end();
});
