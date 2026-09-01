import { createHandler } from "@pondfm/server-utils";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";

export const upgradeSubscriptionHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await db(tablenames.subscriptions).where({ user_id: session.user.id }).update({
      plan_id: getLookupQuery(tablenames.plans, req.body.plan_label),
    });
    return res.end();
  }
)