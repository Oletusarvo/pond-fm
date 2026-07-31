import { notificationService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { TNotification } from '../../../../types/notification-type';
import { createHandler } from '../../../../utils/create-handler';

export const markNotificationsAsSeenHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const notifications = req.body.items as any[];
    const session = req.session;
    //Abort if any of the notifications do not belong to the authenticated user.
    if (notifications.some(n => n.recipient.id !== session.user.id)) {
      return res.status(403).end();
    }
    const promise = db.transaction(async trx => {
      for (const n of notifications) {
        await notificationService.markNotificationAs({ id: n.id, isSeen: true }, trx);
      }
    });
    promise.catch(err => {
      console.log('Failed to mark notifications as read!', err.message);
    });
    return res.end();
  },
);
