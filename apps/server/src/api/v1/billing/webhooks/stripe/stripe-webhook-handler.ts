import { createHandler } from "@pondfm/server-utils";
import { TRequest } from "../../../../../types/request";
import { checkoutSessionCompleted } from "./event-handlers/checkout-session-completed";
import { checkoutSessionExpired } from "./event-handlers/checkout-session-expired";
import { customerDeleted } from "./event-handlers/customer-deleted";
import { customerSubscriptionCreated } from "./event-handlers/customer-subscription-created";
import { customerSubscriptionDeleted } from "./event-handlers/customer-subscription-deleted";
import { customerSubscriptionUpdated } from "./event-handlers/customer-subscription-updated";
import { refundCreated } from "./event-handlers/refund-created";
import { invoicePaid } from "./event-handlers/invoice-paid";
import { Event } from "stripe";

const handlers: Partial<Record<Event["type"], any>> = {
  "checkout.session.completed": checkoutSessionCompleted,
  "checkout.session.expired": checkoutSessionExpired,
  "customer.deleted": customerDeleted,
  "customer.subscription.created": customerSubscriptionCreated,
  "customer.subscription.updated": customerSubscriptionUpdated,
  "customer.subscription.deleted": customerSubscriptionDeleted,
  "refund.created": refundCreated,
  "invoice.paid": invoicePaid,
} as const;

/**Handles webhook events sent by Stripe.*/
export const stripeWebhookHandler = createHandler(
  async (req: TRequest<Event>, res) => {
    const event = req.body;
    const handler = handlers[event.type];
    if (handler) {
      handler(event.data.object);
    } else {
      console.log("Unhandled stripe event: ", event.type);
    }
    return res.end();
  },
);
