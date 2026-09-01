import { findUserByEmail } from "../../../../DAL/users/find-user-by-email";
import { db } from "../../../../db-config";
import { serverConfig } from "../../../../server-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { createJWT } from "../../../../utils/jwt";

export const refreshSessionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;

    const user = await findUserByEmail(db, {
      email: session.user.email
    });

    const token = createJWT({
      ...session,
      user,
    });
    return res.cookie(serverConfig.accessTokenName, token, serverConfig.sessionCookieSettings).end();
  }
)