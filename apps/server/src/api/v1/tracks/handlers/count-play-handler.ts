import { serverConfig } from "../../../../server-config";
import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler, retry } from "@pondfm/server-utils";
import { formatErrorMessage } from "../../../../utils/format-error-message";
import { TAuthenticatedRequest, WithStreamToken } from "../../../../types/request";
import { tablenames } from "../../../../tablenames";

export const countPlayHandler = createHandler(
  async (req: WithStreamToken<TAuthenticatedRequest>, res) => {
    const trackId = req.params.trackId as string;
    const streamSession = await db(tablenames.streamSessions)
      .where({
        id: req.streamToken.stream_session_id,
        session_id: req.sessionToken.id,
        track_id: trackId,
        is_used: false,
      })
      .andWhereRaw("CURRENT_TIMESTAMP < expires_at")
      .first();

    if (!streamSession) {
      console.log("No stream session found.");
      return res.status(204).end();
    }
    const now = new Date();
    const playCountableAt = new Date(streamSession.play_countable_at);
    if (now.getTime() < playCountableAt.getTime()) {
      console.log("A play cannot be counted yet!");
      return res.status(204).end();
    }

    await retry(
      async () =>
        await db.transaction(async (trx) => {
          const options = {
            track_id: trackId,
            user_id: streamSession.user_id,
            session_id: streamSession.session_id,
          };
          await services.scrobbles.countPlay(options, trx);
          await services.scrobbles.countUniqueListener(options, trx);
          await services.scrobbles.createPlayEvent(
            { track_id: trackId, user_id: streamSession.user_id },
            trx,
          );
          await trx(tablenames.streamSessions).where({ id: streamSession.id }).update({
            is_used: true,
          });
        }),
      {
        delay: 1000,
      },
    );
    //Fire and forget
    const pruningPromise = services.scrobbles.pruneUniqueListeners(trackId, db);
    pruningPromise.catch((err) => {
      console.log(
        formatErrorMessage("countPlayHandler", "Pruning of unique listeners failed!"),
        err.message,
      );
    });

    return res.end();
  },
);
