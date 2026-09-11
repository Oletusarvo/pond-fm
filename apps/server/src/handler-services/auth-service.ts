import { authorizeByCodeHandler } from "../api/v1/auth/handlers/authorize-by-code-handler";
import { requestAuthorizationHandler } from "../api/v1/auth/handlers/request-authorization-handler";

export class AuthService {
  requestAuthorization = requestAuthorizationHandler.bind(
    this,
  ) as typeof requestAuthorizationHandler;
  authorizeByCode = authorizeByCodeHandler.bind(
    this,
  ) as typeof authorizeByCodeHandler;
}
