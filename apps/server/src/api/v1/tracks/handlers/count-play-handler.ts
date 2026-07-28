import { serverConfig } from '../../../../../server-config';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { createHandler } from '../../../../utils/create-handler';

export const countPlayHandler = createHandler(async (req, res) => {
  const { trackId } = req.body as { trackId: string };
  const now = Date.now();

  if (req.streamToken?.trackId !== trackId) {
    return res.status(409).end();
  }

  if (now < req.streamToken.countValidAt) {
    return res.status(204).end();
  }
  await postService.countPlay(trackId, db);
  res.clearCookie(serverConfig.streamTokenName, serverConfig.streamCookieSettings);
  return res.end();
});
