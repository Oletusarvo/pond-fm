import { TUser } from '@pondfm/app-shared';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

export const updateUserHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const payload = req.body;
    await db(tablenames.users)
      .where({ id: session.user.id } as TUser)
      .update(payload);
    return res.end();
  },
);
