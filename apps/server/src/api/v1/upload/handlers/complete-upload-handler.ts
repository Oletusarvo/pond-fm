import path from "path";
import { db } from "../../../../db-config";
import { tablenames, viewnames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { generateWaveformDataFromStream } from "../../../../utils/generate-waveform-data";
import { createReadStream } from 'fs';
import { getUploadById } from "../../../../DAL/uploads/get-upload-by-id";
import { createSignedStreamUrl } from "../../../../utils/signed-stream";
import { withTrack } from "../../../../DAL/posts/with/with-track";
import { Readable } from "stream";
import { getDuration } from "../../../../utils/calculate-audio-duration";
import { retry } from "@pondfm/server-utils";

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

    await db(tablenames.uploadFolders).where({ id: db.select('upload_folder_id').from(tablenames.uploads).where({ id: uploadToken.upload_id }) }).update({
      status: 'processing_audio',
      updated_at: db.fn.now(),
    });

    const track = await db({ track: viewnames.tracks })
      .where({
        'track.key': db.select('key').from(tablenames.uploads).where({ id: uploadToken.upload_id }).limit(1)
      })
      .select('id', 'key', 'upload_folder_id')
      .first();

    try {
      return await db.transaction(async trx => {
        //Calculate duration
        const duration = await retry(async () => await calculateDuration(track.id), {
          retries: 3,
        });
        //Generate waveform
        const waveform = await retry(async () => await generateWaveform(track.key, track.id, duration), { retries: 3 });

        //Save upload
        await trx(tablenames.audio).where({ upload_id: uploadToken.upload_id }).update({
          duration,
          waveform: JSON.stringify(waveform)
        });

        await db(tablenames.uploadTokens).where({ upload_id: uploadToken.upload_id }).del();
        await db(tablenames.uploadFolders).where({ id: track.upload_folder_id }).update({
          status: 'active',
          updated_at: db.fn.now(),
        });
        return res.end();
      })
    }
    catch (err) {
      await db.transaction(async trx => {
        await trx(tablenames.tracks).where({ id: track.id }).del();
        await trx(tablenames.uploadFolders).where({ id: track.upload_folder_id }).update({
          status: 'failed_upload',
          updated_at: db.fn.now(),
        });
      })
      throw err;
    }
  }
)

async function calculateDuration(trackId: string) {
  const signedStreamUrl = await createSignedStreamUrl(trackId) as string;
  const duration = await getDuration(signedStreamUrl);
  return duration;
}

async function generateWaveform(uploadKey: string, trackId: string, duration: number) {
  const signedStreamUrl = await createSignedStreamUrl(trackId) as string;
  const waveformStream = await getFileStream(signedStreamUrl, uploadKey) as any;
  const waveform = await generateWaveformDataFromStream(waveformStream, duration);
  return waveform;
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

    default: {
      const filePath = path.join(process.cwd(), key);
      const stream = createReadStream(filePath);
      return stream;
    }
  }
}