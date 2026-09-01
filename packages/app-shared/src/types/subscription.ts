
export type TSubscriptionStatus = 'active' | 'canceled' | 'incomplete' | 'trialing' | 'unpaid' | 'incomplete_expired' | 'past_due' | 'paused';

export type TSubscription = {
  user_id: string;
  status: TSubscriptionStatus;
  created_at: string;
  updated_at: string;
  storage_quota_bytes: number;
  storage_quota_consumed: number;
  override_expires_at?: string;
  override_started_at?: string;
} & ({
  plan_id: 'pro';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  stripe_customer_id: string;
  stripe_subscription_id: string;
} | {
  plan_id: 'free',
  current_period_start: null;
  current_period_end: null;
  cancel_at_period_end: null;
  stripe_customer_id: null | string;
  stripe_subscription_id: null;
});

/**The subscription type displayed to the subscription owner. */
export type TSubscriptionRestricted = Omit<TSubscription, 'stripe_customer_id' | 'stribe_subscription_id'>;

/**The subscription type displayed to the public. */
export type TSubscriptionPublic = Pick<TSubscription, 'plan_id'>;