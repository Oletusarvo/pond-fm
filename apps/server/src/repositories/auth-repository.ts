import { createAuthToken } from '../DAL/auth/create-auth-token';
import { deleteAuthTokenById } from '../DAL/auth/delete-auth-token-by-id';
import { findValidTokenByCode } from '../DAL/auth/find-token-by-code';
import { Repository } from './repository';

export class AuthRepository {
  /**Returns an unexpired and unused auth token by its code. */
  findValidTokenByCode = findValidTokenByCode
  /**Inserts a new authorization token, or replaces an existing one. */
  createAuthToken = createAuthToken
  deleteAuthTokenById = deleteAuthTokenById
}
