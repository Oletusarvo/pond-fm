import { createMiddleware, loadEnvVariable } from "@pondfm/server-utils";
import { stripe } from "../../../../stripe-config";

export const verifyStripeSignature = createMiddleware(
  async (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    if (!signature || typeof signature !== 'string') {
      return res.status(400).json({
        error: 'Missing Stripe-Signature header',
      });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        req.body, // must be the RAW request body (Buffer or string)
        signature,
        loadEnvVariable('STRIPE_WEBHOOK_SIGNING_SECRET')
      );

      // Make the verified event available to later handlers
      req.body = event;

      next();
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid Stripe signature',
      });
    }
  }
)