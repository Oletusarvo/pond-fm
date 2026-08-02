import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

export const updateUsernameHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await db(tablenames.users)
      .where({ id: session.user.id })
      .update({ username: req.body.username });
    return res.end();
  },
);
