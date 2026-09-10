import { createHandler } from "@pondfm/server-utils";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { TAuthenticatedRequest } from "../../../../types/request";

export const getHasUnseenNotificationsHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const session = req.session;
    const result = await db(tablenames.notifications)
      .where({ user_id: session.user.id, seen_at: null })
      .count("* as count")
      .first();
    return res.json(result.count);
  },
);
