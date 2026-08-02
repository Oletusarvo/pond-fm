import { feedService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getSearchableFeedHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const q = req.query.q as string | null;
    const session = req.session;
    const cursor = getCursor(req);
    console.log(q);
    const result = await feedService.getSearchableFeed(q, cursor, session, db);
    return res.json(result.data);
  },
);
