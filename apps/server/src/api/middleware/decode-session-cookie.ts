import { serverConfig } from "../../server-config";
import { createMiddleware } from "../../utils/create-handler";
import { verifyJWT } from "../../utils/jwt";

/**
 * @summary Decodes the session cookie of a request if it is present, then includes it as the sessionToken-field in the request.
 * @tags Cookies
 */
export const decodeSessionCookie = createMiddleware(async (req, res, next) => {
  const sessionCookie = req.cookies[serverConfig.anonymousSessionCookieName];
  if (sessionCookie) {
    req.sessionToken = verifyJWT(sessionCookie) as { id: string };
  }
  next();
});
