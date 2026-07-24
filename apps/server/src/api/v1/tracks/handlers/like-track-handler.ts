import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';

/**Records a like on a track by id. */
export const likeTrackHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const result = await postService.likeTrack(
    {
      userId: session.user.id,
      trackId: req.body.trackId,
    },
    db,
  );
  if (result.success === false) {
    return res.status(409).json({ error: result.error });
  }
  return res.end();
});
