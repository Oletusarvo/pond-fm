import { db } from '../../../../db-config';
import { getUndiscoveredPosts } from '../../../../query/posts/get-undiscovered-posts';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { asArray } from '../../../../utils/as-array';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

/**Returns the main track feed. */
export const getDiscoveryFeed = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const cursor = getCursor(req);
  const { genres, moods } = req.query as { genres?: string[] | string; moods?: string[] | string };
  const session = req.session || null;
  const result = await getUndiscoveredPosts(db, {
    cursor, session, genres: asArray(genres), moods: asArray(moods),
  });
  return res.json(result);
});
