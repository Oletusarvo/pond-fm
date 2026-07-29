import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { serviceError } from '../../../../utils/service-error';

/**Records a repost by a user on a track by id. */
export const repostTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const { trackId } = req.body as { trackId: string };
    const result = await postService.repostTrack(
      {
        user_id: session.user.id,
        track_id: trackId,
      },
      db,
    );

    if (result.success === false && result.error === serviceError.post.duplicateRepost) {
      return res.status(409).json({ error: result.error });
    }

    return res.end();
  },
  (err, res) => {
    const msg = err.message.toUpperCase();
    if (msg.includes('DUPLICATE')) {
      return res.status(409).end();
    }
  },
);
