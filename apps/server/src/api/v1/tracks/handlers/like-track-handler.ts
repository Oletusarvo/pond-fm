import { } from '../../../../container';
import { db } from '../../../../db-config';
import { createNotification } from '../../../../query/notifications/create-notification';
import { createTrackLike } from '../../../../query/posts/create-track-like';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { tryCatch } from '../../../../utils/try-catch';

/**Records a like on a track by id. */
export const likeTrackHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const session = req.session;
  await createTrackLike(db, { trackId: req.body.trackId, userId: session.user.id });

  const notificationPromise = new Promise<void>(async (resolve, reject) => {
    const [result, err] = await tryCatch(async () => {
      const track = await db(tablenames.tracks)
        .where({ id: req.body.trackId })
        .select('author_id')
        .first();
      await createNotification(
        db, {
        notification: {
          recipient_id: track.author_id,
          sender_id: session?.user.id,
          track_id: req.body.trackId,
          type: 'like',
        }
      }
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
