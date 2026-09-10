import { TPayment, TPaymentInsert } from "@pondfm/app-shared";
import { Refund } from "stripe";
import { db } from "../../../../../../db-config";
import { tablenames } from "../../../../../../tablenames";

export async function refundCreated(refund: Refund) {
  await db.transaction(async (trx) => {
    await trx(tablenames.payments)
      .where({
        stripe_payment_intent_id: refund.payment_intent,
      } as TPayment)
      .update({
        refunded_at: new Date(refund.created * 1000),
      } as TPaymentInsert);
  });
}
