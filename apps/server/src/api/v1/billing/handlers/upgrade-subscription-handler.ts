import { createHandler } from "@pondfm/server-utils";

import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { planIdSchema, TSubscription } from "@pondfm/app-shared";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";

const schema = z.object({ plan_id: planIdSchema });

/**Upgrades the currently authenticated users subscription. */
export const upgradeSubscriptionHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof schema>>, res) => {
    const session = req.session;
    await db(tablenames.subscriptions)
      .where({ user_id: session.user.id } as Pick<TSubscription, "user_id">)
      .update({
        plan_id: req.body.plan_id,
      } as Pick<TSubscription, "plan_id">);
    return res.end();
  },
);
