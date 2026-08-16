import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";
import { withTrack } from "../../posts/with/with-track";

export function withSubscription(query: Knex.QueryBuilder) {
  query
    .with('subscription', qb => {
      withTrack(qb);
      qb
        .from({ subscription: tablenames.subscriptions })
        .join({ plan: tablenames.plans }, 'plan.id', 'subscription.plan_id')
        .leftJoin({ override: tablenames.subscriptionQuotaOverrides }, 'override.subscription_id', 'subscription.id')
        .select(
          'subscription.id',
          'subscription.user_id',
          'subscription.plan_id',
          db.raw(`COALESCE(override.storage_quota_mib, plan.storage_quota_mib) AS storage_quota_mib`),
          'plan.label as label',
          db.raw(`(
            SELECT 
            SUM(track.size::numeric) 
            FROM track 
            WHERE track.author_id = subscription.user_id AND track.status <> 'deleted') 
            AS storage_quota_consumed
            `)
        )
        .distinctOn('subscription.id');
    })
  return query;
}