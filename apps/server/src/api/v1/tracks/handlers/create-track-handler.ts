import { v4 } from 'uuid';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { tryCatch } from '../../../../utils/try-catch';

export const createTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest & { file: any }, res) => {
    const session = req.session;
    const { title, tags } = req.body;
    const file = req.file;
    await db.transaction(async trx => {
      await postService.create({ title, tags, userId: session.user.id, file }, trx);
    });
    return res.status(200).end();
  },
  (err, res) => {
    const msg = err.message.toUpperCase();
    if (msg.includes('DUPLICATE')) {
      return res.status(409).end();
    }
  },
);
