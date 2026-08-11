import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function withSubscription(query: Knex.QueryBuilder) {
  query.with('subscription', qb => {
    qb
      .from({ subscription: tablenames.subscriptions })
      .join({ plan: tablenames.plans }, 'plan.id', 'subscription.plan_id')
      .leftJoin({ override: tablenames.subscriptionQuotaOverrides }, 'override.subscription_id', 'subscription.id')
      .select(
        'subscription.id',
        'subscription.user_id',
        'subscription.plan_id',
        db.raw(`COALESCE(override.storage_quota_mib, plan.storage_quota_mib) AS storage_quota_mib`),
        'plan.label as label')
      .distinctOn('subscription.id');
  })
  return query;
}