import { Subscription } from "stripe";
import { tablenames } from "../../../../../../tablenames";
import {
  TPlanId,
  TSubscription,
  TSubscriptionInsert,
} from "@pondfm/app-shared";
import { db } from "../../../../../../db-config";

export async function customerSubscriptionCreated(subscription: Subscription) {
  //Update the users subscription.
  await db(tablenames.subscriptions)
    .where({
      user_id: subscription.metadata.subscription_user_id,
    } as Pick<TSubscription, "user_id">)
    .update({
      stripe_subscription_id: subscription.id,
      plan_id: db
        .from(tablenames.plans)
        .where({ stripe_price_id: subscription.items.data[0].price.id })
        .select("id")
        .limit(1) as unknown as TPlanId,
      cancel_at_period_end: subscription.cancel_at_period_end,
      current_period_start: new Date(
        subscription.items.data.at(0)?.current_period_start * 1000,
      ),
      current_period_end: new Date(
        subscription.items.data.at(0)?.current_period_end * 1000,
      ),
    } as TSubscriptionInsert);
}
