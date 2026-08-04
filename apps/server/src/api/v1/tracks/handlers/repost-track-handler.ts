import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createNotification } from '../../../../query/notifications/create-notification';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { serviceError } from '../../../../utils/service-error';
import { tryCatch } from '../../../../utils/try-catch';

/**Records a repost by a user on a track by id. */
export const repostTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const { trackId } = req.body as { trackId: string };
    const result = await postService.repostTrack(
      db,
      {
        post: {
          user_id: session.user.id,
          track_id: trackId,
        }
      },
    );

    if (result.success === false && result.error === serviceError.post.duplicateRepost) {
      return res.status(409).json({ error: result.error });
    }
    const notificationPromise = new Promise<void>(async (resolve, reject) => {
      const [result, err] = await tryCatch(async () => {
        const track = await db(tablenames.tracks)
          .where({ id: req.body.trackId })
          .select('user_id AS author_id')
          .first();
        await createNotification(
          db,
          {
            notification: {
              recipient_id: track.author_id,
              sender_id: session?.user.id,
              track_id: req.body.trackId,
              type: 'repost',
            }
          },
        );
      });

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

    notificationPromise.catch(err =>
      console.log('Creating of repost notification failed!', err.message),
    );

    return res.end();
  },
  (err, res) => {
    const msg = err.message.toUpperCase();
    if (msg.includes('DUPLICATE')) {
      return res.status(409).end();
    }
  },
);
