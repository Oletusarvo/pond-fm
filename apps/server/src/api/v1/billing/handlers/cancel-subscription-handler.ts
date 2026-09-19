import { createHandler, retry } from "@pondfm/server-utils";

import { stripe } from "../../../../stripe-config";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { TPayment, TSubscription } from "@pondfm/app-shared";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Cancels the currently authenticated users subcription. */
export const cancelSubscriptionHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const localSubscription = (await db(tablenames.subscriptions)
    .where({ user_id: req.session.user.id, plan_id: "pro" })
    .whereNotNull("stripe_subscription_id")
    .first()) as TSubscription;

  if (!localSubscription) {
    return res.status(409).json({
      error: "subscription:nothing-to-cancel",
    });
  }

  const payment = (await db(tablenames.payments)
    .where({ subscription_user_id: localSubscription.user_id })
    .select("stripe_payment_intent_id", "refunded_at")
    .orderBy("paid_at", "desc")
    .first()) as Pick<TPayment, "stripe_payment_intent_id" | "refunded_at">;

  if (payment.refunded_at) {
    return res.status(409).json({
      error: "subscription:already-refunded",
    });
  }

  //This handler should check if the subscription is within the 14-day refund window. If it is, cancel it outright and refund the customer. Otherwise set the subscription to cancel at the period end.
  const subscription = await stripe.subscriptions.retrieve(
    localSubscription.stripe_subscription_id,
  );
  const createdAt = subscription.created * 1000;

  const ageInDays = (Date.now() - createdAt) / (1000 * 60 * 60 * 24);

  await db(tablenames.subscriptions)
    .where({
      user_id: localSubscription.user_id,
    } as TSubscription)
    .update({
      status: "canceled",
    } as TSubscription);

  try {
    if (ageInDays <= 14) {
      /*Refund the customer and cancel the subscription. 
          Also delete oldest files that contribute to free plan quota overage. 
          File deletion should be handled in the stripe webhook.
        */

      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.id);
      await stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
      });
    } else {
      //Cancel at period end; do not refund.
      console.log("Updating subscription...");
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true,
      });
    }
  } catch (err) {
    //Revert the db update
    await db(tablenames.subscriptions)
      .where({
        user_id: localSubscription.user_id,
        status: "canceled",
      } as TSubscription)
      .update({
        status: "active",
      } as TSubscription);
  }

  return res.end();
});
