import { createMiddleware } from "@pondfm/server-utils";
import { tablenames } from "../../../../tablenames";
import { db } from "../../../../db-config";
import { TRequest } from "../../../../types/request";
import { createUserIfNotExists } from "../../../../DAL/users/create-new-user";

export const requireUsedStreamToken = createMiddleware(
  async (req: TRequest<{ trackId: string }>, res, next) => {
    const trackId = req.params.trackId || req.body.trackId;
    const sessionToken = req.sessionToken;
    const streamSession = await db(tablenames.streamSessions)
      .where({ track_id: trackId, is_used: true, session_id: sessionToken.id })
      .andWhereRaw("CURRENT_TIMESTAMP - stream_started_at < INTERVAL '2h'")
      .orderBy("stream_started_at", "DESC")
      .first();

    if (!streamSession) {
      return res.status(403).end();
    }
    next();
  },
);
