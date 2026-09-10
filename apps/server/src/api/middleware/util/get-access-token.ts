import { serverConfig } from "../../../server-config";
import { TRequest } from "../../../types/request";

/**Retrieves the access token with the name defined in serverConfig.accessTokenName from the request cookies. */
export function getAccessToken(req: TRequest) {
  //First try the cookie.
  let token = req.cookies[serverConfig.accessTokenName];
  return token;
}
