import { db } from "../../../../db-config";
import { createNotification } from "../../../../DAL/notifications/create-notification";
import { tablenames } from "../../../../tablenames";

import { createHandler, tryCatch } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { trackInteractionSchema } from "../../../../schemas/track-interaction-schema";
import z from "zod";

/**Records a repost by a user on a track by id. */
export const repostTrackHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof trackInteractionSchema>>, res) => {
    const session = req.session;
    const { trackId } = req.body;

    await db(tablenames.posts).insert({
      track_id: trackId,
      author_id: session.user.audius_user_id,
    });

    const notificationPromise = new Promise<void>(async (resolve, reject) => {
      const [result, err] = await tryCatch(async () => {
        const track = await db(tablenames.tracks)
          .where({ id: req.body.trackId })
          .select("author_id")
          .first();
        await createNotification(db, {
          notification: {
            recipient_id: track.author_id,
            sender_id: session?.user.id,
            track_id: req.body.trackId,
            type: "repost",
          },
        });
      });

      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });

    notificationPromise.catch((err) =>
      console.log("Creating of repost notification failed!", err.message),
    );

    return res.end();
  },
  (err, res) => {
    const msg = err.message.toUpperCase();
    if (msg.includes("DUPLICATE")) {
      return res.status(409).end();
    }
  },
);
