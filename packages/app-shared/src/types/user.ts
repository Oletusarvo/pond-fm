import type { TSubscription, TSubscriptionPublic, TSubscriptionRestricted } from "./subscription.js";

export type TUserStatus = 'active' | 'pending_verification' | 'deleted' | 'suspended';
/**The type for users. */
export type TUser = {
  id: string;
  email: string;
  username: string;
  unseen_notification_count: number;
  status: TUserStatus;
  subscription: TSubscription;
}

/**The user type displayed for the authenticated user themselves. */
export type TUserRestricted = Omit<TUser, 'subscription'> & {
  subscription: TSubscriptionRestricted;
}

/**The user type displayed to the public. */
export type TUserPublic = Pick<TUser, 'id' | 'username'> & {
  subscription: TSubscriptionPublic;
}