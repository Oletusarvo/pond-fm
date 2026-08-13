import { createMiddleware } from "@pondfm/server-utils";
import { getAccessToken } from "./util/get-access-token";
import { AuthenticatedExpressRequest } from "../../types/express";

export const includeAuth = createMiddleware(async (req: AuthenticatedExpressRequest, res, next) => {
  const token = getAccessToken(req);
  if (token) {
    //Decode the token and include the session as part of the request.
  }
});
