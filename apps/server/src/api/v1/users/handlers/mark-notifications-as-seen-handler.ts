import { db } from "../../../../db-config";
import { markNotificationAs } from "../../../../DAL/notifications/mark-notifications-as";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Marks all notifications of the currently authenticated user as seen. */
export const markNotificationsAsSeenHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const session = req.session;
    const promise = db.transaction(async (trx) => {
      await markNotificationAs(trx, {
        user: { id: session.user.id },
        notification: { seen: true },
      });
    });
    promise.catch((err) => {
      console.log("Failed to mark notifications as read!", err.message);
    });
    return res.end();
  },
);
