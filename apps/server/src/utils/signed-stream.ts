import { signCommand } from "@pondfm/crypto";
import { db } from "../db-config";
import { withTrack } from "../DAL/posts/with/with-track";
import { loadEnvVariable } from "@pondfm/server-utils";

/**Creates a signed url for streaming.
 * @deprecated Use urlSigner.stream.sign instead.
 */
export async function createSignedStreamUrl(trackId: string) {
  const objectStoreEnv = process.env.OBJECT_STORE_ENV;
  const track = await withTrack(db.queryBuilder())
    .from("track")
    .where({ "track.id": trackId })
    .first();
  switch (objectStoreEnv) {
    case "cloudflare":
      return createSignedAWSStreamUrl(track.key);
    case "custom":
      return createCustomSignedStreamUrl(track.key);
    default:
      return createLocalSignedStreamUrl(track.id);
  }
}

async function createLocalSignedStreamUrl(trackId: string) {
  return `http://localhost:3002/api/v1/tracks/${trackId}/stream`;
}

/**Creates a a signed url for streaming from a custom upload-server. */
async function createCustomSignedStreamUrl(key: string) {
  const command = {
    key,
    clientId: loadEnvVariable("LOCAL_UPLOAD_CLIENT_ID", false),
  };
  const secretKey = loadEnvVariable("URL_SIGN_SECRET");
  const signature = signCommand(command, secretKey);
  const destinationUrl = loadEnvVariable("CUSTOM_UPLOAD_API");
  const url = new URL([destinationUrl, "stream", key].join("/"));
  url.searchParams.set("X-Client-ID", command.clientId);
  url.searchParams.set("X-Signature", signature);
  return url.toString();
}

async function createSignedAWSStreamUrl(key: string) {
  throw new Error("Function not implemented!");
}
