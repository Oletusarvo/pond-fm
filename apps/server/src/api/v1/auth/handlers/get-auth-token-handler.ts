import { createHandler, createJWT, loadEnvVariable } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { findUserById } from "../../../../DAL/users/find-user-by-id";
import { services } from "../../../../container";
import { createNewUser } from "../../../../DAL/users/create-new-user";
import { serverConfig } from "../../../../server-config";
import { audius, REDIRECT_URI } from "../../../../audius.config";

export const getAuthTokenHandler = createHandler(async (req, res) => {
  const { code, state } = req.query as { code: string; state: string };
  const loginSession = await db(tablenames.loginSessions).where({ state, is_used: false }).first();
  if (!loginSession) {
    return res.status(401).json({
      error: "auth:no-login-session",
    });
  }

  const tokenResponse = await fetch("https://api.audius.co/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      code_verifier: loginSession.verifier,
      client_id: loadEnvVariable("AUDIUS_API_KEY"),
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!tokenResponse.ok) {
    console.log(await tokenResponse.text(), tokenResponse.statusText);
    return res.status(401).json({
      error: "auth:could-not-fetch-token",
    });
  }
  const token = await tokenResponse.json();
  const userDataResponse = await fetch("https://api.audius.co/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
  });
  if (!userDataResponse.ok) {
    return res.status(404).json({
      error: "auth:audius-user-not-found",
    });
  }
  const { data: audiusUser } = await userDataResponse.json();

  const user = await db.transaction(async (trx) => {
    await trx(tablenames.loginSessions).where({ id: loginSession.id }).update({
      is_used: true,
    });

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
  return res.redirect("http://localhost:5173/undiscovered");
});
