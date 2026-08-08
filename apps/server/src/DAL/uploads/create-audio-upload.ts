import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createAudioUpload(ctx: DBContext, config: { uploadId: string; bitrate?: number }) {
  const [audio] = await ctx(tablenames.audio).insert({
    upload_id: config.uploadId,
    bitrate: config.bitrate,
  }).returning('upload_id');
  return audio;
}