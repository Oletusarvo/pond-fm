import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createJWT } from "./jwt";
import { maxLength } from "zod";
import crypto from 'crypto';

export async function createSignedUploadUrl(key: string, contentType: string, maxSize: number) {
  const uploadEnv = process.env.UPLOAD_ENVIRONMENT || 'development';
  return uploadEnv === 'production' ? createAWSSignedUploadUrl(key, contentType, maxSize) : createLocalSignedUploadUrl(key, contentType, maxSize);
}

async function createAWSSignedUploadUrl(key: string, contentType: string, maxSize: number) {
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

async function createLocalSignedUploadUrl(key: string, contentType: string, maxSize: number) {
  const command = {
    key,
    'content-length': maxSize.toString(),
    'content-type': contentType,
  }
  const signature = signCommand(command);
  const url = new URL(['http://localhost:3002/api/v1/upload', key].join('/'));
  url.searchParams.set('signature', signature);
  return url.toString();
}

export function signCommand(command: { 'content-type': string; 'content-length': string; key: string }) {
  const canonicalRequest = [
    command.key,
    command['content-length'],
    command['content-type'],
  ].join('\n');
  const secretKey = process.env.SIGNED_URL_SECRET;
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(canonicalRequest)
    .digest('hex');
  return signature;
}

export function compareSignature(command: Parameters<typeof signCommand>[0], signature: string) {
  return signCommand(command) === signature;
}