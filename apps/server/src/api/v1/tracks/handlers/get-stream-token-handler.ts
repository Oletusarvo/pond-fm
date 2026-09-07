import { serverConfig } from "../../../../server-config";
import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { viewnames } from "../../../../tablenames";
import { createHandler } from "../../../../utils/create-handler";
import { urlSigner } from "../../../../features/url-signer/url-signer";
import { TTrack } from "@pondfm/app-shared";

/**Creates a stream token cookie, allowing starting of streams and counting of plays.
 * @returns An object containing a streamUrl-field
 */
export const getStreamTokenHandler = createHandler(async (req, res) => {
  const { trackId } = req.params as { trackId: string };
  const track = (await db(viewnames.tracks)
    .where({ id: trackId })
    .select("key", "duration", "id")
    .first()) as Pick<TTrack, "key" | "duration" | "id">;
  const result = await postService.createStreamToken(track);

  const signedStreamUrl = await urlSigner.stream.sign({
    key: track.key,
  });

  return res
    .cookie(
      serverConfig.streamTokenName,
      result.data,
      serverConfig.streamCookieSettings,
    )
    .json({
      streamUrl: signedStreamUrl,
    });
});
