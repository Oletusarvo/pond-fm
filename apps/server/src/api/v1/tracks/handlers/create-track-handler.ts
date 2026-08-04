import { v4 } from 'uuid';
import { postService } from '../../../../container';
import { db } from '../../../../db-config';
import { tablenames } from '../../../../tablenames';
import { AuthenticatedExpressRequest } from '../../../../types/express';
import { createHandler } from '../../../../utils/create-handler';
import { tryCatch } from '../../../../utils/try-catch';
import { parseFile } from 'music-metadata';
import { generateWaveformData } from '../../../../utils/generate-waveform-data';
import { createCanonicalTrack } from '../../../../query/posts/create-canonical-track';

export const createTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest & { file: any }, res) => {
    const session = req.session;
    const metadata = await parseFile(req.file.path);
    const waveform = await generateWaveformData(req.file.path);

    await db.transaction(async trx => {
      await postService.createCanonicalTrack(trx, {
        track: {
          title: req.body.title,
          user_id: session.user.id,
          filename: req.file.filename,
          genre: req.body.genre,
          moods: JSON.parse(req.body.moods),
          duration: metadata.format.duration,
          waveform,
        }
      });
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
