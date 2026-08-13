import { serverConfig } from '../../../../server-config';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { createHandler } from '../../../../utils/create-handler';
import { createSignedStreamUrl } from '../../../../utils/signed-stream';

/**Sets a token as a cookie, allowing starting of streams and counting of plays. */
export const getStreamTokenHandler = createHandler(async (req, res) => {
  const { trackId } = req.params as { trackId: string };
  const result = await postService.createStreamToken(db, { trackId });
  const signedStreamUrl = await createSignedStreamUrl(trackId);
  console.log('Stream url: ', signedStreamUrl);

  return res
    .cookie(serverConfig.streamTokenName, result.data, serverConfig.streamCookieSettings)
    .json({
      streamUrl: signedStreamUrl,
    });
});
