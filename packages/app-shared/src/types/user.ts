import z from "zod";
import type {
  TSubscription,
  TSubscriptionPublic,
  TSubscriptionRestricted,
} from "./subscription.js";

export const userStatusSchema = z.enum([
  "active",
  "pending_verification",
  "deleted",
  "suspended",
] as const);

export type TUserStatus = z.infer<typeof userStatusSchema>;

/**The type for users. */
export type TUser = {
  id: string;
  audius_user_id: string;
  audius_handle: string;
  email: string;
  username: string;
  bio?: string;
  unseen_notification_count: number;
  follower_count: number;
  following_count: number;
  followed_by_me: boolean;
  status: TUserStatus;
  subscription: TSubscription;
  urls: string[];
};

/**The user type displayed for the authenticated user themselves. */
export type TUserRestricted = Omit<TUser, "subscription"> & {
  subscription: TSubscriptionRestricted;
};

/**The user type displayed to the public. */
export type TUserPublic = Pick<
  TUser,
  "id" | "username" | "bio" | "follower_count" | "following_count" | "followed_by_me" | "urls"
> & {
  subscription: TSubscriptionPublic;
};
