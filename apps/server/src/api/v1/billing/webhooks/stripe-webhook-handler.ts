import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";
import { withTrack } from "../../../../DAL/posts/with/with-track";

export const stripeWebhookHandler = createHandler(
  async (req, res) => {
    const event = req.body;
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          //Update the users subscription
          await db(tablenames.subscriptions)
            .where({ id: session.metadata.subscription_id })
            .update({
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer,
            });
        }
      }
        break;

      case 'customer.subscription.created': {
        //Update the users subscription.
        const subscription = event.data.object;
        //console.log('Subscription: ', subscription);
        const plan = await db(tablenames.plans)
          .where({ stripe_price_id: subscription.items.data[0].price.id })
          .select('id').first();

        await db(tablenames.subscriptions)
          .where({ id: subscription.metadata.subscription_id })
          .update({
            stripe_subscription_id: subscription.id,
            plan_id: plan.id,
            status: 'active',
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
          });
      }
        break;

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await db(tablenames.subscriptions).where({ id: subscription.metadata.id }).update({
          cancel_at_period_end: subscription.cancel_at_period_end,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
        });
      }
        break;

      case 'customer.subscription.deleted': {
        /*
          Return the relevant subscription back to a free-plan. 
          Delete oldest files that contribute to quota overage.
        */
        const subscription = event.data.object;
        const localSubscription = await db(tablenames.subscriptions).where({ id: subscription.id }).first();
        const currentStorage = await withTrack(db.queryBuilder())
          .from('track')
          .where({ 'track.author_id': localSubscription.user_id })
          .andWhereNot({ 'track.status': 'deleted' })
          .sum('track.size AS size')
          .first();

        //Mark oldest files contributing to overage as deleted.
        const plan = await db(tablenames.plans).where({ id: localSubscription.plan_id }).select('storage_quota_mib').first();
        const quotaOverage = currentStorage.size > plan.storage_quota_mib ? BigInt(currentStorage.size - plan.storage_quota_mib) : 0n;
        const uploadStream = withTrack(db.queryBuilder())
          .from('track')
          .where({ author_id: localSubscription.user_id })
          .select('size', 'primary_audio_id', 'track.id')
          .orderBy('track.created_at', 'asc')
          .stream();

        let sizeDeleted: bigint = 0n;
        for await (const track of uploadStream) {
          if (sizeDeleted < quotaOverage) {
            sizeDeleted += BigInt(track.size);
            await db.transaction(async trx => {
              await trx(tablenames.uploads).where({ id: track.primary_audio_id }).update({ status: 'deleted' });
            });
            continue;
          }

          break;
        }

        await db(tablenames.subscriptions).where({
          id: subscription.metadata.subscription_id
        })
          .update({
            plan_id: getLookupQuery(tablenames.plans, 'free'),
            cancel_at_period_end: null,
            status: 'active'
          });
      }
        break;

      default: { console.error('Unhandled stripe event: ', event.type); return res.status(204).end(); }
    }
    return res.end();
  }
)