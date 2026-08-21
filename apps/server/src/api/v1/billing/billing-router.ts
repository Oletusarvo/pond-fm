import { createBodyParser, getRouter } from "@pondfm/server-utils";
import { checkAuth } from "../../middleware/check-auth";
import { upgradeSubscriptionHandler } from "./routes/upgrade-subscription-handler";
import { stripeWebhookHandler } from "./webhooks/stripe-webhook-handler";
import { checkoutHandler } from "./routes/checkout-handler";
import { getSubscriptionStatusHandler } from "./routes/get-subscription-status";

const router = getRouter();

router.patch('/subscriptions/checkout', checkAuth(), checkoutHandler);
router.get('/subscriptions/status', checkAuth(), getSubscriptionStatusHandler);
router.post('/webhook/stripe', stripeWebhookHandler);
export { router as billingRouter }