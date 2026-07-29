import { serverConfig } from '../../../../../server-config';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { formatErrorMessage } from '../../../../utils/format-error-message';

export const countPlayHandler = createHandler(async (req: AuthenticatedExpressRequest, res) => {
  const trackId = req.params.trackId;
  const session = req.session;
  const now = Date.now();

  if (req.streamToken?.trackId !== trackId) {
    return res.status(409).end();
  }

  if (now < req.streamToken.countValidAt) {
    return res.status(204).end();
  }

  const result = await postService.countPlay(trackId, db);

  //Fire and forget
  db.transaction(async trx => {
    await postService.updateUniqueListeners(
      {
        playCount: result.data,
        userId: session?.user.id,
        trackId,
      },
      trx,
    );
  }).catch(err => {
    console.log(
      formatErrorMessage('countPlayHandler', 'Updating of unique listeners failed!'),
      err.message,
    );
  });

  res.clearCookie(serverConfig.streamTokenName, serverConfig.streamCookieSettings);
  return res.end();
});
