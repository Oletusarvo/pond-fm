import type { TUser } from "./user.js";

export type TAuthor = Pick<TUser, 'id' | 'username'>;