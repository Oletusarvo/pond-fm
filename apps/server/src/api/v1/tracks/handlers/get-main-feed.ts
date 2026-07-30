import { feedService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getMainFeedHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const cursor = getCursor(req);
  const { tag } = req.query as { tag: string };
  const result = await feedService.getMainFeed(cursor, req.session, tag, db);
  return res.json(result.data);
});
