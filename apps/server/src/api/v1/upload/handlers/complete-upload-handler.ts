import path from "path";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
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
import { trackSchema } from "../../../../schemas/track-schema";

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

    const uploadRecord = await getUploadById(db, { id: uploadToken.upload_id });
    const track = await withTrack(db.queryBuilder())
      .from('track')
      .where({ 'track.key': uploadRecord.key })
      .select('id').first();



    try {
      return await db.transaction(async trx => {
        //Calculate duration
        const duration = await retry(async () => await calculateDuration(track.id), {
          retries: 3,
        });
        //Generate waveform
        const waveform = await retry(async () => await generateWaveform(uploadRecord.key, track.id, duration), { retries: 3 });

        //Save upload
        await trx(tablenames.audio).where({ upload_id: uploadRecord.id }).update({
          duration,
          waveform: JSON.stringify(waveform)
        });

        await db(tablenames.uploadTokens).where({ upload_id: uploadRecord.id }).del();
        await db(tablenames.uploads).where({ id: uploadRecord.id }).update({
          status: 'ready'
        });
        return res.end();
      })
    }
    catch (err) {
      await db.transaction(async trx => {
        await trx(tablenames.tracks).where({ id: track.id }).del();
        await trx(tablenames.uploads).where({ id: uploadRecord.id }).update({
          status: 'failed'
        });
      })
      throw new Error('Failed to complete upload!', {
        cause: err
      });
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