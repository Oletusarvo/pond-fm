import { Checkout } from "stripe";
import { db } from "../../../../../../db-config";
import { tablenames } from "../../../../../../tablenames";

export async function checkoutSessionExpired(session: Checkout.Session) {
  await db(tablenames.subscriptions)
    .where({
      user_id: session.metadata.subscription_user_id,
      plan_id: "free",
    })
    .andWhereNot({
      status: "active",
    })
    .update({
      status: "active",
    });
}
