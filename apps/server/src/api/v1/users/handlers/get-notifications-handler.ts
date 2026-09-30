import { db } from "../../../../db-config";
import { getNotificationsByUserId } from "../../../../DAL/notifications/get-notifications-by-user-id";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

export const getNotificationsHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const cursor = getCursor(req);
  const session = req.session;
  const result = await getNotificationsByUserId(db, {
    user: { audius_user_id: session.user.audius_user_id },
    cursor,
  });
  return res.json(result);
});
