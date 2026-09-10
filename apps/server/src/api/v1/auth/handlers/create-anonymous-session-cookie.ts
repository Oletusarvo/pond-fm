import { v4 } from "uuid";

import { serverConfig } from "../../../../server-config";
import { createHandler, createJWT } from "@pondfm/server-utils";

export const createAnonymousSessionHandler = createHandler(async (req, res) => {
  const token = createJWT({ id: v4() });
  return res
    .cookie(
      serverConfig.anonymousSessionCookieName,
      token,
      serverConfig.anonymousSessionCookieSettings,
    )
    .end();
});
