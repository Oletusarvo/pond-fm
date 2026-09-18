import { findUserById } from "../../../../DAL/users/find-user-by-id";
import { db } from "../../../../db-config";
import { serverConfig } from "../../../../server-config";

import { createHandler, createJWT } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

export const refreshSessionHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  const user = await findUserById(db, {
    id: session.user.id,
  });

  const token = createJWT({
    ...session,
    user,
  });
  return res.cookie(serverConfig.accessTokenName, token, serverConfig.sessionCookieSettings).end();
});
