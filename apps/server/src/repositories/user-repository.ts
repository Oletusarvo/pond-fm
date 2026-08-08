import { activateUserById } from '../DAL/users/activate-by-id';
import { findUserByEmail } from '../DAL/users/find-user-by-email';
import { findUserById } from '../DAL/users/find-user-by-id';
import { createNewUser } from '../DAL/users/create-new-user';

export class UserRepository {
  findById = findUserById
  findByEmail = findUserByEmail
  activateById = activateUserById
  createNewUser = createNewUser
}