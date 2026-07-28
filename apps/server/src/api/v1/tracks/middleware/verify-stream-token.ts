import { serverConfig } from '../../../../../server-config';
import { createMiddleware } from '../../../../utils/create-handler';
import { verifyJWT } from '../../../../utils/jwt';

export const verifyStreamToken = createMiddleware(async (req, res, next) => {
  //Check the stream token.
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
