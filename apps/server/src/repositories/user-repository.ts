import { activateUserById } from '../query/users/activate-by-id';
import { findUserByEmail } from '../query/users/find-user-by-email';
import { findUserById } from '../query/users/find-user-by-id';
import { createNewUser } from '../query/users/create-new-user';

export class UserRepository {
  findById = findUserById
  findByEmail = findUserByEmail
  activateById = activateUserById
  createNewUser = createNewUser
}