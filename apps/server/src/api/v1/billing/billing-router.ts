import { getRouter } from "@pondfm/server-utils";
import { checkAuth } from "../../middleware/check-auth";
import { checkoutHandler } from "./handlers/checkout-handler";
import { getSubscriptionStatusHandler } from "./handlers/get-subscription-status";
import { cancelSubscriptionHandler } from "./handlers/cancel-subscription-handler";

const router = getRouter();

/**
 * PATCH /billing/subscriptions/checkout
 * @summary Creates a Stripe checkout session for upgrading the users subscription.
 * @tags Subscriptions
 */
router.patch("/subscriptions/checkout", checkAuth(), checkoutHandler);
/**
 * DELETE /billing/subscriptions/cancel
 * @summary Cancels the currently authenticated users subscription.
 * @tags Subscriptions
 */
router.delete("/subscriptions/cancel", checkAuth(), cancelSubscriptionHandler);
/**
 * GET /billing/subscriptions/status
 * @summary Returns the status of the currently authenticated users subscription.
 * @returns An object containing the fields status and plan_id.
 * @tags Subscriptions
 */
router.get("/subscriptions/status", checkAuth(), getSubscriptionStatusHandler);

export { router as billingRouter };
