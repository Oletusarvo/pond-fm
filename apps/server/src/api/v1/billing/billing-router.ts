import { getRouter } from "@pondfm/server-utils";
import { checkAuth } from "../../middleware/check-auth";
import { checkoutHandler } from "./handlers/checkout-handler";
import { getSubscriptionStatusHandler } from "./handlers/get-subscription-status";
import { cancelSubscriptionHandler } from "./handlers/cancel-subscription-handler";

const router = getRouter();

router.patch('/subscriptions/checkout', checkAuth(), checkoutHandler);
router.delete('/subscriptions/cancel', checkAuth(), cancelSubscriptionHandler);
router.get('/subscriptions/status', checkAuth(), getSubscriptionStatusHandler);

export { router as billingRouter }