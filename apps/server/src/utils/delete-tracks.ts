import { signCommand } from "@pondfm/crypto";
import { db } from "../db-config";
import { tablenames } from "../tablenames";
import { retry } from "@pondfm/server-utils";

export async function deleteTracks(affectedTracks: { id: string, primary_audio_id: string }[]) {
  const keys = await db(tablenames.uploads).whereIn('id', affectedTracks.map(r => r.primary_audio_id)).pluck('key');
  const clientId = process.env.LOCAL_UPLOAD_CLIENT_ID;
  const signature = signCommand({
    clientId,
    key: JSON.stringify(keys.sort()),
  }, process.env.URL_SIGN_SECRET);

  const signedDeleteUrl = new URL([process.env.CUSTOM_UPLOAD_API, 'upload'].join('/'));
  signedDeleteUrl.searchParams.set('X-Signature', signature);
  signedDeleteUrl.searchParams.set('X-Client-ID', clientId);

  await retry(async () => {
    const res = await fetch(signedDeleteUrl, {
      method: 'DELETE',
      body: JSON.stringify({ keys }), headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error("Cloud file deletion failed. Status: " + res.status);
    }
    return res;
  }, {
    retries: 5,
    delay: 1000,
  });

  await retry(async () => await db.transaction(async trx => {
    await trx(tablenames.tracks).whereIn('id', affectedTracks.map(r => r.id)).del();
    await trx(tablenames.uploads).whereIn('key', keys).del();
  }), {
    retries: 5
  });
}