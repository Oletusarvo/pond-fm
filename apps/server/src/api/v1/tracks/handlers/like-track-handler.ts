import { notificationService, postService } from '../../../../container';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { tryCatch } from '../../../../utils/try-catch';

/**Records a like on a track by id. */
export const likeTrackHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  const result = await postService.likeTrack(
    {
      user_id: session.user.id,
      track_id: req.body.trackId,
    },
    db,
  );
  if (result.success === false) {
    return res.status(409).json({ error: result.error });
  }
  const notificationPromise = new Promise<void>(async (resolve, reject) => {
    const [result, err] = await tryCatch(async () => {
      const track = await db(tablenames.tracks)
        .where({ id: req.body.trackId })
        .select('user_id AS author_id')
        .first();
      await notificationService.createNotification(
        {
          recipient_id: track.author_id,
          sender_id: session?.user.id,
          track_id: req.body.trackId,
          type: 'like',
        },
        db,
      );
    });
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });

  notificationPromise.catch(err =>
    console.log('Creating of like notification failed!', err.message),
  );

  return res.end();
});
