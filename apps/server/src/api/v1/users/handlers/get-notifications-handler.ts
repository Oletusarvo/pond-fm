
import { db } from '../../../../db-config';
import { getNotificationsByUserId } from '../../../../DAL/notifications/get-notifications-by-user-id';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getNotificationsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const cursor = getCursor(req);
    const session = req.session;
    const result = await getNotificationsByUserId(db, { user: { id: session.user.id }, cursor });
    return res.json(result);
  },
);
