import z from "zod";
import type {
  subscriptionSchema,
  subscriptionStatusSchema,
} from "../schemas/subscription-schema.js";

export type TSubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export type TSubscription = z.infer<typeof subscriptionSchema>;

/**The subscription type displayed to the subscription owner. */
export type TSubscriptionRestricted = Omit<
  TSubscription,
  "stripe_customer_id" | "stribe_subscription_id"
>;

/**The subscription type displayed to the public. */
export type TSubscriptionPublic = Pick<TSubscription, "plan_id">;

/**The type for subscription objects inserted into the db. */
export type TSubscriptionInsert = Omit<
  TSubscription,
  "current_period_start" | "current_period_end"
> & {
  current_period_end: Date;
  current_period_start: Date;
};
