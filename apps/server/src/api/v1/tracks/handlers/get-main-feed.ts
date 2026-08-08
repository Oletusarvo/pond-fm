import { db } from '../../../../db-config';
import { getNewPosts } from '../../../../DAL/posts/get-new-posts';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { asArray } from '../../../../utils/as-array';
import { createHandler } from '../../../../utils/create-handler';
import { getCursor } from '../../../../utils/get-cursor';

export const getMainFeedHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const cursor = getCursor(req);
  const { genres, moods } = req.query as { genres?: string[]; moods?: string[] };
  const session = req.session;
  const result = await getNewPosts(db, {
    session, cursor, genres: asArray(genres), moods: asArray(moods),
  });
  return res.json(result);
});
