import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getAuthorFeed = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const { authorId } = req.params as { authorId: string };
  const session = req.session;
  const cursor = getCursor(req);
  const result = await postService.getAuthorFeed(authorId, cursor, session, db);
  return res.json(result.data);
});
