import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { db } from "../../../../db-config";
import { tablenames, viewnames } from "../../../../tablenames";

export const getSubscriptionStatusHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const subscription = await db({ subscription: viewnames.subscriptions })
      .where({ user_id: session.user.id })
      .select('status', 'plan_id')
      .first();

    return res.json({
      status: subscription.status,
      plan_id: subscription.plan_id,
    });
  }
)