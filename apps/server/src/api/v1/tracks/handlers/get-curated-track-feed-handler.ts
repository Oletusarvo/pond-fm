import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { decodeCursor, encodeCursor } from '../../../../utils/cursor';
import { withCursor } from '../../../../utils/with-cursor';

/**Returns a curated feed of tracks based on the users filter tags. */
export const getCuratedTrackFeedHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    return res.status(501).end();
  },
);
