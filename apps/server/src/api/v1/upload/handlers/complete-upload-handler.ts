import path from "path";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { generateWaveformDataFromStream } from "../../../../utils/generate-waveform-data";
import { createReadStream } from 'fs';
import { getUploadById } from "../../../../DAL/uploads/get-upload-by-id";
import { createCanonicalPost } from "../../../../DAL/posts/create-canonical-post";
import { parseStream } from "music-metadata";
import { createSignedStreamUrl } from "../../../../utils/signed-stream";
import { withTrack } from "../../../../DAL/posts/with/with-track";
import { Readable } from "stream";

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
          const { waveformStream, metadataStream } = await createStreams(uploadRecord.key);

          const metadata = await parseStream(metadataStream, {
            mimeType: uploadRecord.mimeType,
          });
          const waveform = await generateWaveformDataFromStream(waveformStream, metadata.format.duration);

          await trx(tablenames.audio).where({ upload_id: uploadRecord.id }).update({
            duration: metadata.format.duration,
            waveform: JSON.stringify(waveform),
          });

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
    promise.catch(async err => {
      console.log('Failed to complete upload!', err.message);
    });

    return res.end();
  }
)

async function createStreams(key: string): Promise<{ metadataStream: Readable; waveformStream: Readable }> {
  const objectStoreEnv = process.env.OBJECT_STORE_ENV;

  switch (objectStoreEnv) {
    case 'custom': {
      const track = await withTrack(db.queryBuilder())
        .from('track')
        .where({ 'track.key': key })
        .select('id').first();

      const signedStreamUrl = await createSignedStreamUrl(track.id) as string;
      const fileRequest = await fetch(signedStreamUrl, { method: 'GET' });
      if (!fileRequest.ok) {
        throw new Error("Failed to fetch file stream for processing!");
      }
      const [waveformBody, durationBody] = fileRequest.body.tee();

      return {
        waveformStream: Readable.fromWeb(waveformBody),
        metadataStream: Readable.fromWeb(durationBody),
      };
    }
      break;

    default: {
      const filePath = path.join(process.cwd(), key);
      const fileStream = createReadStream(filePath);
      const webStream = Readable.toWeb(fileStream);
      const [waveformBody, durationBody] = webStream.tee();
      const waveformStream = Readable.fromWeb(waveformBody);
      const metadataStream = Readable.fromWeb(durationBody);

      return {
        waveformStream,
        metadataStream,
      };

    }
  }
}