import { signCommand } from "@pondfm/crypto";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { loadEnvVariable } from "@pondfm/server-utils";

/**
 * Calls the dedicated function for generating an upload url based on the OBJECT_STORE_ENV env-variable.
 * @deprecated Use urlSigner.upload.sign instead.
 */
export async function createSignedUploadUrl(
  key: string,
  contentType: string,
  maxSize: number,
) {
  const uploadEnv = process.env.OBJECT_STORE_ENV;
  switch (uploadEnv) {
    case "cloudflare":
      return createAWSSignedUploadUrl(key, contentType, maxSize);
    case "custom":
      return createCustomSignedUploadUrl(key, contentType, maxSize);
    default:
      return createLocalSignedUploadUrl(key, contentType, maxSize);
  }
}

/**Creates an upload url for Cloudflare. */
async function createAWSSignedUploadUrl(
  key: string,
  contentType: string,
  maxSize: number,
) {
  const r2 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

  const command = new PutObjectCommand({
    Bucket: "audio",
    Key: key,
    ContentType: contentType,
    ContentLength: maxSize,
  });

  const uploadUrl = await getSignedUrl(r2, command, {
    expiresIn: 60 * 10,
  });

  return uploadUrl;
}

/**Creates an url for uploads to a custom upload-server. */
async function createCustomSignedUploadUrl(
  key: string,
  contentType: string,
  maxSize: number,
) {
  const clientId = loadEnvVariable("LOCAL_UPLOAD_CLIENT_ID");
  const command = {
    key,
    clientId,
    "content-length": maxSize.toString(),
    "content-type": contentType,
  };
  const secretKey = loadEnvVariable("URL_SIGN_SECRET");
  const customApi = loadEnvVariable("CUSTOM_UPLOAD_API");
  const signature = signCommand(command, secretKey);
  const url = new URL([customApi, "upload", key].join("/"));
  url.searchParams.set("X-Client-ID", command.clientId);
  url.searchParams.set("X-Signature", signature);
  return url.toString();
}

/**Creates an upload url for local uploads. */
async function createLocalSignedUploadUrl(
  key: string,
  contentType: string,
  maxSize: number,
) {
  const command = {
    key,
    "content-length": maxSize.toString(),
    "content-type": contentType,
  };
  const secretKey = loadEnvVariable("URL_SIGN_SECRET");
  const signature = signCommand(command, secretKey);
  const url = new URL(["http://localhost:3002/api/v1/upload", key].join("/"));
  url.searchParams.set("X-Signature", signature);
  return url.toString();
}
