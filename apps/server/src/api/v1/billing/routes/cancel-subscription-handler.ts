import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { stripe } from "../../../../stripe-config";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";

export const cancelHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const subscription = await db(tablenames.subscriptions).where({ user_id: req.session.user.id, plan_id: getLookupQuery(tablenames.plans, 'pro') }).first();
    if (!subscription) {
      return res.status(409).json({
        error: 'subscription:nothing-to-cancel'
      });
    }

    //This handler should check if the subscription is within the 14-day refund window. If it is, cancel it outright and refund the customer. Otherwise set the subscription to cancel at the period end.
    const now = new Date();
    const periodStart = new Date(subscription.current_period_start);
    const interval = now.getTime() - periodStart.getTime();
    const refundWindow = 1000 * 60 * 60 * 24 * 14 // 14 days.
    if (interval <= refundWindow) {
      /*Refund the customer and cancel the subscription. 
        Also delete oldest files that contribute to free plan quota overage. 
        File deletion should be handled in the stripe webhook.
      */
    }
    else {
      //Cancel at period end; do not refund.
      await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }

    return res.status(204).end();
  }
)