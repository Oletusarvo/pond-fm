import { v4 } from 'uuid';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { tryCatch } from '../../../../utils/try-catch';
import { parseFile } from 'music-metadata';
import { generateWaveformData } from '../../../../utils/generate-waveform-data';

export const createTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest & { file: any }, res) => {
    const session = req.session;
    const metadata = await parseFile(req.file.path);
    const waveform = await generateWaveformData(req.file.path);

    await db.transaction(async trx => {
      await postService.create(
        {
          title: req.body.title,
          userId: session.user.id,
          file: req.file,
          tags: ['Electronic'],
          duration: metadata.format.duration,
          waveform,
        },
        trx,
      );
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
