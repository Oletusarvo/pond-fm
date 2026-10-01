import { createHandler, createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { createNewUser } from "../../../../DAL/users/create-new-user";
import { serverConfig } from "../../../../server-config";
import { audius, REDIRECT_URI } from "../../../../audius.config";

export const exchangeAudiusCodeForTokenHandler = createHandler(async (req, res) => {
  const { code, state } = req.query as { code: string; state: string };
  const loginSession = await db(tablenames.loginSessions)
    .where({ state, is_used: false })
    .andWhereRaw("expires_at > CURRENT_TIMESTAMP")
    .first();

  if (!loginSession) {
    return res.status(401).json({
      error: "auth:no-login-session",
    });
  }

  const token = await audius.auth.getToken(code, loginSession.verifier);
  const audiusUser = await audius.auth.me(token.access_token);

  const user = await db.transaction(async (trx) => {
    await trx(tablenames.loginSessions).where({ id: loginSession.id }).update({ is_used: true });
    return await createNewUser(trx, {
      user: {
        audius_user_id: audiusUser.id,
      },
    });
  });

  const session = createJWT(
    { user },
    {
      expiresIn: "90d",
    },
  );
  res.cookie(serverConfig.accessTokenName, session, serverConfig.sessionCookieSettings);
  return res.end();
});
