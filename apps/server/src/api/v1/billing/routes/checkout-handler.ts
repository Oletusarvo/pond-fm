import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getDomainUrl } from "../../../../utils/get-domain-url";
import { stripe } from '../../../../stripe-config';

export const checkoutHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const subscription = await db({ subscription: tablenames.subscriptions })
      .join({ user: tablenames.users }, 'user.id', 'subscription.user_id')
      .join({ plan: tablenames.plans }, 'plan.id', 'subscription.plan_id')
      .where({ user_id: req.session.user.id })
      .select('subscription.id', 'user.id as user_id', 'user.email as user_email', 'subscription.stripe_customer_id', 'plan.label')
      .first();

    if (!subscription) {
      return res.status(404).json({
        error: 'subscription:not-found'
      });
    }
    else if (subscription.label == 'pro') {
      return res.status(409).json({
        error: 'subscription:already-pro'
      });
    }

    await db(tablenames.subscriptions).where({ id: subscription.id }).update({
      status: 'pending'
    });

    let customerId = subscription.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: subscription.user_email,
        metadata: {
          user_id: subscription.user_id,
        },
      });

      customerId = customer.id;
    }

    const plan = await db(tablenames.plans).where({ label: 'pro' }).select('stripe_price_id').first();
    if (!plan) {
      console.log('No pro plan defined!');
      return res.status(500).end();
    }
    else if (!plan.stripe_price_id) {
      console.log('Stripe price id missing from plan: ', plan);
      return res.status(500).end();
    }

    return db.transaction(async trx => {
      await trx(tablenames.subscriptions).where({ id: subscription.id }).update({
        status: 'incomplete'
      });
      const APP_URL = getDomainUrl();
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [
          {
            price: plan.stripe_price_id,
            quantity: 1,
          },
        ],
        metadata: {
          subscription_id: subscription.id,
        },
        subscription_data: {
          metadata: {
            subscription_id: subscription.id,
          }
        },
        success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/`,
      });

      if (session.url == null) {
        console.log('Failed to create a session.')
        return res.status(500).end();
      }

      return res.json({
        checkoutUrl: session.url
      })
    })

  }
)