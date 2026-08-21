import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

export const getSubscriptionStatusHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const subscription = await db(tablenames.subscriptions).where({ user_id: session.user.id }).select('status').first();
    return res.json({
      status: subscription.status
    });
  }
)