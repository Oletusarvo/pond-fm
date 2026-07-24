import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Returns the session object encoded by the authenticated user's token. */
export const getSessionInfoHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    return res.json({ session: req.session });
  },
);
