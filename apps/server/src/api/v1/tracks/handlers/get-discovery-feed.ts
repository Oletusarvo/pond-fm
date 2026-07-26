import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';
import { withCursor } from '../../../../utils/with-cursor';

/**Returns the main track feed. */
export const getDiscoveryFeed = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const cursor = getCursor(req);
  const session = req.session || null;
  const result = await postService.getDiscoveryFeed(cursor, session, db);
  return res.json({
    data: result.data.tracks,
    cursor: result.data.cursor,
  });
});
