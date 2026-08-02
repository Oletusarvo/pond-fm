import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

export const getHasUnseenNotificationsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const result = await db(tablenames.notifications)
      .where({ user_id: session.user.id, seen_at: null })
      .count('* as count')
      .first();
    return res.json(result.count);
  },
);
