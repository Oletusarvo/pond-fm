import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames, viewnames } from "../../../../tablenames";
import { stripe } from "../../../../stripe-config";
import { Checkout, Customer, Invoice, Refund, Subscription } from "stripe";
import { TPayment, TPaymentInsert, TPlanId, TSubscription, TSubscriptionInsert, TTrack } from "@pondfm/app-shared";
import { TUploadFolder } from "@pondfm/app-shared/dist/types/upload-folder";

export const stripeWebhookHandler = createHandler(
  async (req, res) => {
    const event = req.body;
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Checkout.Session;
        if (session.mode === 'subscription' && session.subscription) {
          //Update the users subscription
          await db(tablenames.subscriptions)
            .where({ user_id: session.metadata.subscription_user_id } as TSubscription)
            .update({
              stripe_subscription_id: session.subscription,
              stripe_customer_id: session.customer,
            } as TSubscription);
        }
      }
        break;

      case 'customer.subscription.created': {
        //Update the users subscription.
        const subscription = event.data.object as Subscription;
        await db(tablenames.subscriptions)
          .where({ user_id: subscription.metadata.subscription_user_id } as Pick<TSubscription, 'user_id'>)
          .update({
            stripe_subscription_id: subscription.id,
            plan_id: db
              .from(tablenames.plans)
              .where({ stripe_price_id: subscription.items.data[0].price.id })
              .select('id')
              .limit(1) as unknown as TPlanId,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.items.data.at(0)?.current_period_start * 1000),
            current_period_end: new Date(subscription.items.data.at(0)?.current_period_end * 1000),
          } as TSubscriptionInsert);
      }
        break;

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Subscription;
        await db(tablenames.subscriptions)
          .where({ stripe_subscription_id: subscription.id } as Pick<TSubscription, 'stripe_subscription_id'>).update({
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(subscription.items.data.at(0)?.current_period_start * 1000),
            current_period_end: new Date(subscription.items.data.at(0)?.current_period_end * 1000),
          } as TSubscriptionInsert);
      }
        break;

      case 'customer.subscription.deleted': {
        /*
          Return the relevant subscription back to a free-plan. 
          Delete oldest files that contribute to quota overage.
        */
        const subscription = event.data.object as Subscription;
        const userId = subscription.metadata.subscription_user_id;
        //Update the user to a free plan beforehand so the quota calculations reflect their new plan state.
        const subscriptionRowsAffected = await db(tablenames.subscriptions)
          .where({
            stripe_subscription_id: subscription.id,
          } as TSubscription)
          .update({
            plan_id: 'free',
            cancel_at_period_end: null,
            current_period_end: null,
            current_period_start: null,
            status: 'active'
          } as TSubscriptionInsert);

        if (subscriptionRowsAffected == 0) {
          return res.status(204).end();
        }

        const localSubscription = await db({ subscription: viewnames.subscriptions })
          .where({ 'subscription.user_id': userId } as { 'subscription.user_id': TSubscription['user_id'] })
          .select(
            'subscription.user_id',
            'subscription.storage_quota_bytes',
            'subscription.storage_quota_consumed'
          )
          .first() as Pick<TSubscription, 'user_id' | 'storage_quota_bytes' | 'storage_quota_consumed'>;

        const storageQuotaConsumed = BigInt(localSubscription.storage_quota_consumed);
        const storageQuota = BigInt(localSubscription.storage_quota_bytes);

        const quotaOverage =
          storageQuotaConsumed > storageQuota
            ?
            storageQuotaConsumed - storageQuota
            :
            0n;

        const uploadStream = db({ track: viewnames.tracks })
          .where({ author_id: localSubscription.user_id } as TTrack)
          .select('size_bytes AS size', 'upload_folder_id', 'track.id', 'track.created_at')
          .orderBy('track.created_at', 'asc')
          .stream();

        await db.transaction(async trx => {
          let sizeDeleted: bigint = 0n;
          for await (const track of uploadStream) {
            if (sizeDeleted >= quotaOverage) break;

            await trx(tablenames.uploadFolders)
              .where({
                id: track.upload_folder_id
              } as TUploadFolder)
              .update({ status: 'deleted' } as TUploadFolder);
            sizeDeleted += BigInt(track.size);
          }

          await trx(tablenames.subscriptions)
            .where({ stripe_subscription_id: subscription.id } as TSubscription)
            .update({
              stripe_subscription_id: null
            } as TSubscription);
        });
      }
        break;

      case 'refund.created': {
        const refund = event.data.object as Refund;
        await db.transaction(async trx => {
          await trx(tablenames.payments).where({
            stripe_payment_intent_id: refund.payment_intent,
          } as TPayment)
            .update({
              refunded_at: new Date(refund.created * 1000),
            } as TPaymentInsert);
          /*
        const userIdSubQuery = db
          .select('subscription_user_id')
          .from(tablenames.payments)
          .where({ stripe_payment_intent_id: refund.payment_intent })
          .limit(1);

        //Revert to a free plan. Do not remove overrides.
        await trx(tablenames.subscriptions).where({
          user_id: userIdSubQuery,
        })
          .andWhereNot({
            plan_id: 'free'
          })
          .update({
            plan_id: 'free',
          });*/
        })

      }
        break;

      case 'customer.deleted': {
        const customer = event.data.object as Customer;
        await db(tablenames.subscriptions)
          .where({ stripe_customer_id: customer.id } as TSubscription)
          .update({
            stripe_customer_id: null,
          } as TSubscription);
      }
        break;

      case 'invoice.paid': {
        const invoice = event.data.object as Invoice;
        const userId = invoice.parent.subscription_details.metadata.subscription_user_id;

        // Retrieve invoice with payment expansion
        const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
          expand: ['payments.data.payment.payment_intent'],
        });

        const paymentIntent =
          fullInvoice.payments?.data?.[0]?.payment?.payment_intent;

        if (
          paymentIntent &&
          typeof paymentIntent !== 'string'
        ) {
          await db.transaction(async trx => {
            await trx(tablenames.payments).insert({
              subscription_user_id: userId,
              stripe_payment_intent_id: paymentIntent.id,
              stripe_invoice_id: invoice.id,
              amount_in_decimal: invoice.amount_paid,
              paid_at: new Date(invoice.status_transitions.paid_at * 1000),
            } as TPaymentInsert)
              .onConflict()
              .ignore();

            await trx(tablenames.subscriptions).where({
              user_id: userId,
            } as TSubscription)
              .update({
                status: 'active'
              } as TSubscription);
          })

        }
        else {
          console.error("Stripe webhook: Could not process payment intent as it is either undefined or isn't an object!");
        }
      }
        break;

      default: { console.error('Unhandled stripe event: ', event.type); return res.status(204).end(); }
    }
    return res.end();
  }
)