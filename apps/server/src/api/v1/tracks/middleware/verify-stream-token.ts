import { serverConfig } from '../../../../server-config';
import { createMiddleware } from '../../../../utils/create-handler';
import { verifyJWT } from '../../../../utils/jwt';

/**Checks a stream token is present as a cookie and verifies it.
 * It being for the track it refers to is left for other middleware or handlers. */
export const verifyStreamToken = createMiddleware(async (req, res, next) => {
  const streamToken = req.cookies[serverConfig.streamTokenName];
  if (!streamToken) {
    return res.status(401).end();
  }

  const tokenData = verifyJWT(streamToken) as any;
  const now = Date.now();
  if (now >= tokenData.expires) {
    return res.status(401).end();
  }
  req.streamToken = tokenData;
  next();
});
