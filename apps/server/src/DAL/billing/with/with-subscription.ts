import { Knex } from "knex";
import { tablenames, viewnames } from "../../../tablenames";
import { db } from "../../../db-config";
import { withTrack } from "../../posts/with/with-track";

export function withSubscription(query: Knex.QueryBuilder) {
  query
    .with('subscription', qb => {
      qb
        .from({ subscription: tablenames.subscriptions })
        .join({ plan: tablenames.plans }, 'plan.id', 'subscription.plan_id')
        .leftJoin({ override: tablenames.subscriptionQuotaOverrides }, 'override.user_id', 'subscription.user_id')
        .select(
          'subscription.user_id',
          'subscription.plan_id',
          'plan.id as label',
          db.raw(`COALESCE(override.storage_quota_bytes, plan.storage_quota_bytes) AS storage_quota_bytes`),
          db.raw(`COALESCE((
            SELECT 
            SUM(track.size_bytes::numeric) 
            FROM ?? track 
            WHERE track.author_id = subscription.user_id AND track.status <> 'deleted'), 0) 
            AS storage_quota_consumed
            `, [viewnames.tracks])
        )
        .distinctOn('subscription.user_id');
    })
  return query;
}