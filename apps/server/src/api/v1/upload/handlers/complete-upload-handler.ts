import path from "path";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { generateWaveformData, generateWaveformDataFromBuffer, generateWaveformDataFromStream } from "../../../../utils/generate-waveform-data";
import { createReadStream, readFileSync, writeFileSync } from 'fs';
import { parseBuffer } from "music-metadata";
import { updateUpload } from "../../../../DAL/uploads/update-upload";
import { getLookupQuery } from "../../../../DAL/util/get-lookup-query";
import { getUploadById } from "../../../../DAL/uploads/get-upload-by-id";
import { createCanonicalPost } from "../../../../DAL/posts/create-canonical-post";
import { parseStream } from "music-metadata";

export const completeUploadHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const uploadToken = await db(tablenames.uploadTokens)
      .where({ code: req.params.code, user_id: session.user.id })
      .first();

    if (!uploadToken) {
      console.log('No upload token found!');
      return res.status(401).end();
    }

    await db(tablenames.uploads).where({ id: uploadToken.upload_id }).update({
      status: 'processing'
    });

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        await db.transaction(async trx => {
          //Generate waveform and activate the track.
          const uploadRecord = await getUploadById(trx, { id: uploadToken.upload_id });
          const filePath = path.join(process.cwd(), uploadRecord.key);
          const waveformStream = createReadStream(filePath);
          const metadataStream = createReadStream(filePath);

          const metadata = await parseStream(metadataStream, {
            mimeType: uploadRecord.mimeType,
          });
          const waveform = await generateWaveformDataFromStream(waveformStream, metadata.format.duration);

          await trx(tablenames.audio).where({ upload_id: uploadRecord.id }).update({
            duration: metadata.format.duration,
            waveform: JSON.stringify(waveform),
          });

          await createCanonicalPost(trx, {
            track: {
              title: req.body.title,
              genre: req.body.genre,
              moods: req.body.moods,
              authorId: session.user.id,
              audioId: uploadRecord.id,
            } as any
          })

          await trx(tablenames.uploadTokens).where({ upload_id: uploadToken.upload_id }).del();
          await trx(tablenames.uploads).where({ id: uploadRecord.id }).update({
            status: 'ready'
          });
          resolve();
        })
      }
      catch (err) {
        reject(err);
      }
    });
    promise.catch(err => console.log('Failed to complete upload!', err.message))

    return res.end();
  }
)