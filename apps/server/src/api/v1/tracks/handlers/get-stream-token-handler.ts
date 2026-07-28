import { serverConfig } from '../../../../../server-config';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

/**Sets a token as a cookie, allowing starting of streams and counting of plays. */
export const getStreamTokenHandler = createHandler(async (req, res) => {
  const { trackId } = req.params as { trackId: string };
  const result = await postService.createStreamToken(trackId, db);
  return res
    .cookie(serverConfig.streamTokenName, result.data, serverConfig.streamCookieSettings)
    .end();
});
