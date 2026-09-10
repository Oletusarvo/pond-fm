import { Customer } from "stripe";
import { db } from "../../../../../../db-config";
import { tablenames } from "../../../../../../tablenames";
import { TSubscription } from "@pondfm/app-shared";

export async function customerDeleted(customer: Customer) {
  await db(tablenames.subscriptions)
    .where({ stripe_customer_id: customer.id } as TSubscription)
    .update({
      stripe_customer_id: null,
    } as TSubscription);
}
