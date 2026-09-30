import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { viewnames } from "../../../../tablenames";
import { audius, audiusSdk } from "../../../../audius.config";
import { serverConfig } from "../../../../server-config";

/**Returns a url from which a track can be streamed. Also creates a stream session, and sets a stream cookie for play counting, liking and reposting. */
export const getStreamUrlHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const { trackId } = req.params;

  const track = await db(viewnames.tracks)
    .where({ audius_track_id: trackId })
    .select("audius_track_id")
    .first();

  const audiusTrack = await audiusSdk.tracks.getTrack({
    trackId: track.audius_track_id,
  });

  const token = await db.transaction(
    async (trx) =>
      await services.posts.createStreamToken(trx, {
        track: audiusTrack.data,
        user: { session_id: req.sessionToken.id },
      }),
  );

  res.cookie(serverConfig.streamTokenName, token.data, serverConfig.streamCookieSettings);
  const session = req.session;
  const streamUrl = await audius.tracks.stream.getUrl(
    track.audius_track_id,
    session?.user.audius_user_id,
  );
  return res.json({
    streamUrl,
  });
});
