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

const baseSubscriptionSchema = z.object({
  user_id: z.string(),
  status: subscriptionStatusSchema,

  created_at: z.string(),
  updated_at: z.string(),

  storage_quota_bytes: z.number(),
  storage_quota_consumed: z.number(),

  override_expires_at: z.string().optional(),
  override_started_at: z.string().optional(),
});

const proSchema = baseSubscriptionSchema.extend({
  plan_id: z.literal("pro"),
  current_period_start: z.string(),
  current_period_end: z.string(),
  cancel_at_period_end: z.boolean(),

  stripe_customer_id: z.string(),
  stripe_subscription_id: z.string(),
});

const freeSchema = baseSubscriptionSchema.extend({
  plan_id: z.literal("free"),
  current_period_start: z.null(),
  current_period_end: z.null(),
  cancel_at_period_end: z.null(),

  stripe_customer_id: z.string().nullable(),
  stripe_subscription_id: z.null(),
});

export const subscriptionSchema = z.discriminatedUnion("plan_id", [
  freeSchema,
  proSchema,
]);
