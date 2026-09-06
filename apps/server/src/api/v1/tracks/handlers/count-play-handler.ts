import { serverConfig } from "../../../../server-config";
import { scrobbleService } from "../../../../container";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { formatErrorMessage } from "../../../../utils/format-error-message";

export const countPlayHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const trackId = req.params.trackId;
    const session = req.session;
    const now = Date.now();

    if (req.streamToken?.trackId !== trackId) {
      return res.status(409).end();
    }

    if (now < req.streamToken.countValidAt) {
      return res.status(204).end();
    }

    await db.transaction(
      async (trx) =>
        await scrobbleService.countPlay(
          {
            track_id: trackId,
            user_id: session?.user.id,
            session_id: req.sessionToken.id,
          },
          trx,
        ),
    );
    //Fire and forget
    const pruningPromise = scrobbleService.pruneUniqueListeners(trackId, db);
    pruningPromise.catch((err) => {
      console.log(
        formatErrorMessage(
          "countPlayHandler",
          "Pruning of unique listeners failed!",
        ),
        err.message,
      );
    });

    res.clearCookie(
      serverConfig.streamTokenName,
      serverConfig.streamCookieSettings,
    );
    return res.end();
  },
);
