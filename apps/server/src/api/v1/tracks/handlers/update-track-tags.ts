import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { serviceError } from '../../../../utils/service-error';

export const updateTrackTagsHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const result = await db.transaction(async trx => {
      return await postService.updateTrackTags(
        {
          editorId: session.user.id,
          trackId: req.body.trackId,
          tags: req.body.tags,
        },
        trx,
      );
    });

    if (result.success === false && result.error === serviceError.auth.forbidden) {
      return res.status(403).end();
    }

    res.end();
  },
);
