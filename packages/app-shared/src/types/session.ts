import { type TUserRestricted } from "./user.js";
import { type JwtPayload } from "jsonwebtoken";

export type TSession = JwtPayload & {
  user: TUserRestricted;
};
