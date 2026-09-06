import { db } from "../../../../db-config";
import { tablenames, viewnames } from "../../../../tablenames";
import {
  AuthenticatedExpressRequest,
  ExpressRequest,
} from "../../../../types/express";
import { createHandler } from "@pondfm/server-utils";
import crypto from "crypto";
import { serviceError } from "../../../../utils/service-error";
import path from "path";
import { v4 } from "uuid";
import { createCanonicalPost } from "../../../../DAL/posts/create-canonical-post";
import {
  ServiceErrorResponse,
  ServiceSuccessResponse,
} from "../../../../types/service-response";
import { TSession, TSubscription } from "@pondfm/app-shared";
import { TUpload } from "@pondfm/app-shared/dist/types/upload";
import { TUploadFolder } from "@pondfm/app-shared/dist/types/upload-folder";
import { urlSigner } from "../../../../features/url-signer/url-signer";
import { createUploadSchema } from "../../../../schemas/create-upload-schema";
import z from "zod";

export const createUploadHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const data = req.body as z.infer<typeof createUploadSchema>;
    const session = req.session;

    //Make sure the file size is within the quota of the user.
    const quotaVerificationResult = await verifyUploadQuota(
      data.upload.size,
      session,
    );
    if (quotaVerificationResult.success !== true) {
      return res.status(409).json({
        error: quotaVerificationResult.error,
      });
    }

    const uploadToken = await db.transaction(async (trx) => {
      const id = v4();
      const extname = path.extname(data.upload.filename);
      const filename = `${id}${extname}`;
      const key = `uploads/${filename}`;
      const [folder] = await trx(tablenames.uploadFolders)
        .insert({
          status: "pending_upload",
          author_id: session.user.id,
        } as TUploadFolder)
        .returning("id");

      const [upload] = await trx(tablenames.uploads)
        .insert({
          id,
          upload_folder_id: folder.id,
          filename,
          key,
          original_filename: data.upload.filename,
          size_bytes: data.upload.size,
          mime_type: data.upload.mimeType,
        } as TUpload)
        .returning("id");

      const [audio] = await trx(tablenames.audio)
        .insert({
          upload_id: upload.id,
        })
        .returning("*");

      await createCanonicalPost(trx, {
        track: {
          title: data.track.title,
          genre: data.track.genre,
          moods: data.track.moods,
          author_id: session.user.id,
          primary_audio_id: upload.id,
        },
      });

      const code = crypto.randomBytes(32).toString("base64url");
      await trx(tablenames.uploadTokens).insert({
        upload_id: audio.upload_id,
        user_id: session.user.id,
        code,
        expires_at: db.raw("CURRENT_TIMESTAMP + INTERVAL '1h'"),
      });

      return {
        code,
        key,
      };
    });

    const signedUrl = await urlSigner.upload.sign({
      key: uploadToken.key,
      contentType: data.upload.mimeType,
      contentLength: data.upload.size,
    });

    return res.status(200).json({
      uploadUrl: signedUrl,
      code: uploadToken.code,
    });
  },
);

async function verifyUploadQuota(uploadedSize: number, session: TSession) {
  const quota = (await db(viewnames.subscriptions)
    .select("storage_quota_bytes", "storage_quota_consumed")
    .where({ user_id: session.user.id })
    .first()) as Pick<
    TSubscription,
    "storage_quota_bytes" | "storage_quota_consumed"
  >;

  if (
    quota.storage_quota_bytes &&
    BigInt(quota.storage_quota_consumed) + BigInt(uploadedSize) >
      BigInt(quota.storage_quota_bytes)
  ) {
    return {
      success: false,
      error: serviceError.upload.quotaExceeded,
    } as ServiceErrorResponse;
  }

  return {
    success: true,
  } as ServiceSuccessResponse;
}
