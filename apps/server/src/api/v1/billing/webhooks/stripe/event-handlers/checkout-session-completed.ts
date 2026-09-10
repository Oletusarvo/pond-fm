import { Checkout } from "stripe";
import { tablenames } from "../../../../../../tablenames";
import { TSubscription } from "@pondfm/app-shared";
import { db } from "../../../../../../db-config";

export async function checkoutSessionCompleted(session: Checkout.Session) {
  if (session.mode === "subscription" && session.subscription) {
    //Update the users subscription
    await db(tablenames.subscriptions)
      .where({
        user_id: session.metadata.subscription_user_id,
      } as TSubscription)
      .update({
        stripe_subscription_id: session.subscription,
        stripe_customer_id: session.customer,
      } as TSubscription);
  }
}
