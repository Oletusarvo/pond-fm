import { userService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Creates or updates the tags of a user. */
export const updateUserTagsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const tags = req.body;
    const session = req.session;
    await db.transaction(async trx => {
      await userService.updateUserTags({ userId: session.user.id, tags }, trx);
    });
    return res.end();
  },
);
