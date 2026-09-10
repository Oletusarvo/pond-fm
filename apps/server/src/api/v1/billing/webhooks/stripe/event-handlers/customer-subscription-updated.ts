import { Subscription } from "stripe";
import { db } from "../../../../../../db-config";
import { tablenames } from "../../../../../../tablenames";
import { TSubscription, TSubscriptionInsert } from "@pondfm/app-shared";

export async function customerSubscriptionUpdated(subscription: Subscription) {
  await db(tablenames.subscriptions)
    .where({ stripe_subscription_id: subscription.id } as Pick<
      TSubscription,
      "stripe_subscription_id"
    >)
    .update({
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: new Date(
        subscription.items.data.at(0)?.current_period_start * 1000,
      ),
      current_period_end: new Date(
        subscription.items.data.at(0)?.current_period_end * 1000,
      ),
    } as TSubscriptionInsert);
}
