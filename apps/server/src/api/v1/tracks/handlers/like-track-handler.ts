import {} from "../../../../container";
import { db } from "../../../../db-config";
import { createNotification } from "../../../../DAL/notifications/create-notification";
import { createTrackLike } from "../../../../DAL/tracks/create-track-like";
import { tablenames } from "../../../../tablenames";

import { createHandler, tryCatch } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { trackInteractionSchema } from "../../../../schemas/track-interaction-schema";

/**Records a like on a track by id. */
export const likeTrackHandler = createHandler(
  async (req: TAuthenticatedRequest<z.infer<typeof trackInteractionSchema>>, res) => {
    const session = req.session;
    await createTrackLike(db, {
      trackId: req.body.trackId,
      userId: session.user.audius_user_id,
    });

    const notificationPromise = new Promise<void>(async (resolve, reject) => {
      const [result, err] = await tryCatch(async () => {
        const track = await db(tablenames.tracks)
          .where({ audius_track_id: req.body.trackId })
          .select("author_id")
          .first();
        await createNotification(db, {
          notification: {
            recipient_id: track.author_id,
            sender_id: session?.user.audius_user_id,
            track_id: req.body.trackId,
            type: "like",
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
      console.log("Creating of like notification failed!", err.message),
    );

    return res.end();
  },
);
