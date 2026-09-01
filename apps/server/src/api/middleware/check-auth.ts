import { JwtPayload } from 'jsonwebtoken';
import { AuthenticatedExpressRequest } from '../../types/express';
import { createMiddleware } from '../../utils/create-handler';
import { verifyJWT } from '../../utils/jwt';
import { getAccessToken } from './util/get-access-token';
import { TSession } from '@pondfm/app-shared';


/**Creates a middleware-function that allows requests through if preventUnauthorizedAccess is false, otherwise returns 401 if an access token is not part of the request. Upon authorized access, adds a TSession-object as part of the request. */
export const checkAuth = (preventUnauthorizedAccess: boolean = true) =>
  createMiddleware(async (req: AuthenticatedExpressRequest, res, next) => {
    const token = getAccessToken(req);
    if (!token && preventUnauthorizedAccess) {
      return res.status(401).end();
    } else if (token) {
      const payload = verifyJWT(token) as TSession;
      req.session = payload;
    }
    next();
  });
