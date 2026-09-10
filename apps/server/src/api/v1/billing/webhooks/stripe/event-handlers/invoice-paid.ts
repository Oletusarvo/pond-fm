import { Invoice } from "stripe";
import { stripe } from "../../../../../../stripe-config";
import { tablenames } from "../../../../../../tablenames";
import { db } from "../../../../../../db-config";
import { TPaymentInsert, TSubscription } from "@pondfm/app-shared";

export async function invoicePaid(invoice: Invoice) {
  const userId =
    invoice.parent.subscription_details.metadata.subscription_user_id;

  // Retrieve invoice with payment expansion
  const fullInvoice = await stripe.invoices.retrieve(invoice.id, {
    expand: ["payments.data.payment.payment_intent"],
  });

  const paymentIntent =
    fullInvoice.payments?.data?.[0]?.payment?.payment_intent;

  if (paymentIntent && typeof paymentIntent !== "string") {
    await db.transaction(async (trx) => {
      await trx(tablenames.payments)
        .insert({
          subscription_user_id: userId,
          stripe_payment_intent_id: paymentIntent.id,
          stripe_invoice_id: invoice.id,
          amount_in_decimal: invoice.amount_paid,
          paid_at: new Date(invoice.status_transitions.paid_at * 1000),
        } as TPaymentInsert)
        .onConflict()
        .ignore();

      await trx(tablenames.subscriptions)
        .where({
          user_id: userId,
        } as TSubscription)
        .update({
          status: "active",
        } as TSubscription);
    });
  } else {
    console.error(
      "Stripe webhook: Could not process payment intent as it is either undefined or isn't an object!",
    );
  }
}
