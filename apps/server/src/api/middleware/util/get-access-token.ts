import { serverConfig } from '../../../server-config';
import { ExpressRequest } from '../../../types/express';

export function getAccessToken(req: ExpressRequest) {
  //First try the cookie.
  let token = req.cookies[serverConfig.accessTokenName];
  return token;
}
