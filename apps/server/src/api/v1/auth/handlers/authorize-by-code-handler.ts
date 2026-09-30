import { serverConfig } from "../../../../server-config";
import { db } from "../../../../db-config";
import { createHandler, createJWT } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { authorizeByCodeSchema } from "../../../../schemas/authorize-by-code-schema";
import z from "zod";
import { findValidTokenByCode } from "../../../../DAL/auth/find-token-by-code";
import { findUserById } from "../../../../DAL/users/find-user-by-id";

const noAuthTokenErrorMessage = "Auth token not found";
const noActiveUserErrorMessage = "User is not active";

/**Authorizes a user by their auth code, returning the session token as a cookie and as part of the response body. */
export const authorizeByCodeHandler = createHandler(
  async (req: TRequest<z.infer<typeof authorizeByCodeSchema>>, res) => {
    const { code } = req.body;
    return await db.transaction(async (trx) => {
      const authToken = await findValidTokenByCode(trx, { code });
      if (!authToken) {
        throw new Error(noAuthTokenErrorMessage);
      }

      const savedUser = await findUserById(trx, {
        audius_user_id: authToken.user_id,
      });

      if (savedUser.status !== "active") {
        throw new Error(noActiveUserErrorMessage);
      }

      const token = createJWT(
        { user: savedUser },
        {
          expiresIn: "90d",
        },
      );
      return res
        .cookie(serverConfig.accessTokenName, token, serverConfig.sessionCookieSettings)
        .end();
    });
  },
  (err, res) => {
    const msg = err.message;
    if (msg.includes(noActiveUserErrorMessage)) {
      return res.status(401).end();
    } else if (msg.includes(noAuthTokenErrorMessage)) {
      return res.status(401).end();
    }
  },
);
