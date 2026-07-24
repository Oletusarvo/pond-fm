import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';
import { withCursor } from '../../../../utils/with-cursor';

export const getMainFeedHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const cursor = getCursor(req);
  const tracks = await postService.getMainFeed(cursor, db);
  return res.json(withCursor(tracks.data));
});
