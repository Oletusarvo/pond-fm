
import { db } from '../../../../db-config';
import { markNotificationAs } from '../../../../query/notifications/mark-notifications-as';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { TNotification } from '../../../../types/notification-type';
import { createHandler } from '../../../../utils/create-handler';

export const markNotificationsAsSeenHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const promise = db.transaction(async trx => {
      await markNotificationAs(trx, { user: { id: session.user.id }, notification: { seen: true } });
    });
    promise.catch(err => {
      console.log('Failed to mark notifications as read!', err.message);
    });
    return res.end();
  },
);
