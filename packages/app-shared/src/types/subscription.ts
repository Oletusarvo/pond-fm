import z from "zod";

export const subscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "incomplete",
  "trialing",
  "unpaid",
  "incomplete_expired",
  "past_due",
  "paused",
] as const);

export type TSubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

const subscriptionBaseSchema = z.object({
  user_id: z.string(),
  status: subscriptionStatusSchema,

  created_at: z.string(),
  updated_at: z.string(),

  storage_quota_bytes: z.number(),
  storage_quota_consumed: z.number(),

  override_expires_at: z.string().optional(),
  override_started_at: z.string().optional(),
});

export const subscriptionSchema = z.discriminatedUnion("plan_id", [
  subscriptionBaseSchema.extend({
    plan_id: z.literal("pro"),

    current_period_start: z.string(),
    current_period_end: z.string(),
    cancel_at_period_end: z.boolean(),

    stripe_customer_id: z.string(),
    stripe_subscription_id: z.string(),
  }),

  subscriptionBaseSchema.extend({
    plan_id: z.literal("free"),

    current_period_start: z.null(),
    current_period_end: z.null(),
    cancel_at_period_end: z.null(),

    stripe_customer_id: z.string().nullable(),
    stripe_subscription_id: z.null(),
  }),
]);

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
