import { createHandler } from "@pondfm/server-utils";

import { db } from "../../../../db-config";
import { tablenames, viewnames } from "../../../../tablenames";
import { TSubscription } from "@pondfm/app-shared";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns the status of the currently authenticated users subscription. */
export const getSubscriptionStatusHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const session = req.session;
    const subscription = (await db({ subscription: viewnames.subscriptions })
      .where({ user_id: session.user.id })
      .select("status", "plan_id")
      .first()) as Pick<TSubscription, "status" | "plan_id">;

    return res.json({
      status: subscription.status,
      plan_id: subscription.plan_id,
    });
  },
);
