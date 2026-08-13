import { serverConfig } from '../../server-config';
import { createMiddleware } from '../../utils/create-handler';
import { verifyJWT } from '../../utils/jwt';

export const decodeSessionCookie = createMiddleware(async (req, res, next) => {
  const sessionCookie = req.cookies[serverConfig.anonymousSessionCookieName];
  if (sessionCookie) {
    req.sessionToken = verifyJWT(sessionCookie) as { id: string };
  }
  next();
});
