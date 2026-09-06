import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";
import { TSubscription } from "@pondfm/app-shared";

export const upgradeSubscriptionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await db(tablenames.subscriptions).where({ user_id: session.user.id } as Pick<TSubscription, 'user_id'>).update({
      plan_id: req.body.plan_id,
    } as Pick<TSubscription, 'plan_id'>);
    return res.end();
  }
)