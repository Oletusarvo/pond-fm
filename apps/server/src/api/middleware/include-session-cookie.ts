import { v4 } from 'uuid';
import { serverConfig } from '../../../server-config';
import { createMiddleware } from '../../utils/create-handler';
import { createJWT } from '../../utils/jwt';

export const includeSessionCookie = createMiddleware(async (req, res, next) => {
  const sessionCookie = req.cookies[serverConfig.anonymousSessionCookieName];
  if (!sessionCookie) {
    const sessionToken = createJWT({ id: v4() });
    res.cookie(
      serverConfig.anonymousSessionCookieName,
      sessionToken,
      serverConfig.anonymousSessionCookieSettings,
    );
  }
  next();
});
