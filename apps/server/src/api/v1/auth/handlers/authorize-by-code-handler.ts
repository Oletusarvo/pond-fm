import { serverConfig } from "../../../../server-config";
import { db } from "../../../../db-config";
import { createHandler, createJWT } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import { authorizeByCodeSchema } from "../../../../schemas/authorize-by-code-schema";
import z from "zod";
import { findValidTokenByCode } from "../../../../DAL/auth/find-token-by-code";
import { findUserByEmail } from "../../../../DAL/users/find-user-by-email";
import { tablenames } from "../../../../tablenames";
import { TUser } from "@pondfm/app-shared";

/**Authorizes a user by their auth code, returning the session token as a cookie and as part of the response body. */
export const authorizeByCodeHandler = createHandler(
  async (req: TRequest<z.infer<typeof authorizeByCodeSchema>>, res) => {
    const { code } = req.body;
    return await db.transaction(async (trx) => {
      const authToken = await findValidTokenByCode(trx, { code });
      if (!authToken) {
        return res.status(401).end();
      }

      const savedUser = await findUserByEmail(trx, {
        email: authToken.user_email,
      });
      if (savedUser.status === "pending_verification") {
        await trx(tablenames.users)
          .where({ id: savedUser.id, status: "pending_verification" } as TUser)
          .update({
            status: "active",
          } as TUser);
      }

      const token = createJWT(
        { user: savedUser },
        {
          expiresIn: "90d",
        },
      );
      return res
        .cookie(
          serverConfig.accessTokenName,
          token,
          serverConfig.sessionCookieSettings,
        )
        .end();
    });
  },
);
