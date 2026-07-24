import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Removes a like from a track. */
export const unlikeTrackHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  await postService.unlikeTrack(
    {
      userId: session.user.id,
      trackId: req.body.trackId,
    },
    db,
  );
  return res.end();
});
