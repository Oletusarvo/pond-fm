import { serverConfig } from "../../../../server-config";
import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { formatErrorMessage } from "../../../../utils/format-error-message";
import {
  TAuthenticatedRequest,
  WithStreamToken,
} from "../../../../types/request";

export const countPlayHandler = createHandler(
  async (req: WithStreamToken<TAuthenticatedRequest>, res) => {
    const trackId = req.params.trackId;
    const session = req.session;
    const now = Date.now();

    if (req.streamToken?.trackId !== trackId) {
      console.log(
        "Failed to count a play on track with id ",
        trackId,
        "; The id in the stream token does not match! (" +
          req.streamToken?.trackId +
          ")",
      );
      return res.status(409).end();
    }

    if (now < req.streamToken.countValidAt) {
      return res.status(204).end();
    }

    await db.transaction(
      async (trx) =>
        await services.scrobbles.countPlay(
          {
            track_id: trackId,
            user_id: session?.user.id,
            session_id: req.sessionToken.id,
          },
          trx,
        ),
    );
    //Fire and forget
    const pruningPromise = services.scrobbles.pruneUniqueListeners(trackId, db);
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
