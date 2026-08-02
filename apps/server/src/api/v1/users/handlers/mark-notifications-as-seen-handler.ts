import { notificationService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { TNotification } from '../../../../types/notification-type';
import { createHandler } from '../../../../utils/create-handler';

export const markNotificationsAsSeenHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const promise = db.transaction(async trx => {
      await notificationService.markNotificationAs({ user_id: session.user.id, seen: true }, trx);
    });
    promise.catch(err => {
      console.log('Failed to mark notifications as read!', err.message);
    });
    return res.end();
  },
);
