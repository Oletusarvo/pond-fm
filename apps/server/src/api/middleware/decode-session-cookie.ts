import {
  createMiddleware,
  verifyJWT,
  ExpressRequest,
} from "@pondfm/server-utils";
import { serverConfig } from "../../server-config";
import { TRequest } from "../../types/request";

/**
 * Decodes the session cookie of a request if it is present, then includes it as the sessionToken-field in the request.
 */
export const decodeSessionCookie = createMiddleware(
  async (req: TRequest, res, next) => {
    const sessionCookie = req.cookies[serverConfig.anonymousSessionCookieName];
    if (sessionCookie) {
      req.sessionToken = verifyJWT(sessionCookie) as { id: string };
    }
    next();
  },
);
