import { serverConfig } from "../../../../server-config";
import { authService, userService } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { authorizeByCodeSchema } from "../../../../schemas/authorize-by-code-schema";
import z from "zod";

/**Authorizes a user by their auth code, returning the session token as a cookie and as part of the response body. */
export const authorizeByCodeHandler = createHandler(
  async (req: TRequest<z.infer<typeof authorizeByCodeSchema>>, res) => {
    const { code } = req.body;
    return await db.transaction(async (trx) => {
      const authResult = await authService.authorizeUserByCode(trx, { code });
      if (authResult.success === false) {
        console.log(authResult.error);
        return res.status(401).end();
      }

      const sessionTokenResult = await authService.createSessionToken(trx, {
        authToken: authResult.data,
      });
      return res
        .cookie(
          serverConfig.accessTokenName,
          sessionTokenResult.data,
          serverConfig.sessionCookieSettings,
        )
        .end();
    });
  },
);
