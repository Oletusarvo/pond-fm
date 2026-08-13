import { serverConfig } from "../../../../server-config";
import { findUserByEmail } from "../../../../DAL/users/find-user-by-email";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { createJWT } from "../../../../utils/jwt";

export const refreshSessionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const newSession = req.body;
    const session = req.session;
    if (newSession.user.id !== session.user.id) {
      return res.status(401).end();
    }

    const token = createJWT(newSession);
    return res.cookie(serverConfig.accessTokenName, token, serverConfig.sessionCookieSettings).end();
  }
)