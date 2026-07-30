import { notificationService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getNotificationsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const cursor = getCursor(req);
    const session = req.session;
    const result = await notificationService.getNotifications(cursor, session?.user.id, db);
    return res.json(result.data);
  },
);
