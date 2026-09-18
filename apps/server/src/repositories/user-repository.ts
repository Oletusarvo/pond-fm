import { activateUserById } from "../DAL/users/activate-by-id";
import { findUserById } from "../DAL/users/find-user-by-id";

import { createNewUser } from "../DAL/users/create-new-user";

export class UserRepository {
  findById = findUserById;
  findUserById = findUserById;
  activateById = activateUserById;
  createNewUser = createNewUser;
}
