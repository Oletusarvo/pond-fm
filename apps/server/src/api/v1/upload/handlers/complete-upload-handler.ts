import path from "path";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { generateWaveformDataFromStream } from "../../../../utils/generate-waveform-data";
import { createReadStream, ReadStream } from 'fs';
import { getUploadById } from "../../../../DAL/uploads/get-upload-by-id";
import { createCanonicalPost } from "../../../../DAL/posts/create-canonical-post";
import { parseStream } from "music-metadata";
import { createSignedStreamUrl } from "../../../../utils/signed-stream";
import { withTrack } from "../../../../DAL/posts/with/with-track";
import { Readable } from "stream";
import { getDuration } from "../../../../utils/calculate-audio-duration";

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
          const track = await withTrack(db.queryBuilder())
            .from('track')
            .where({ 'track.key': uploadRecord.key })
            .select('id').first();

          const signedStreamUrl = await createSignedStreamUrl(track.id) as string;
          const duration = await getDuration(signedStreamUrl);
          const waveformStream = await getFileStream(signedStreamUrl, uploadRecord.key) as any;

          const waveform = await generateWaveformDataFromStream(waveformStream, duration);

          await trx(tablenames.audio).where({ upload_id: uploadRecord.id }).update({
            duration,
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

async function calculateDuration(stream: Readable, mimeType: string) {
  const metadata = await parseStream(stream, { mimeType });
  console.log(metadata.format);
  return metadata;
}

async function getFileStream(signedStreamUrl: string, key: string): Promise<Readable> {
  const objectStoreEnv = process.env.OBJECT_STORE_ENV;

  switch (objectStoreEnv) {
    case 'custom': {
      const stream = await fetch(signedStreamUrl);
      if (!stream.ok) {
        throw new Error("Failed to fetch file stream for processing!");
      }
      return Readable.fromWeb(stream.body);
    }
      break;

    default: {
      const filePath = path.join(process.cwd(), key);
      const stream = createReadStream(filePath);
      return stream;
    }
  }
}