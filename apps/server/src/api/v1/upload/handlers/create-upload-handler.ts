import { db } from "../../../../db-config";
import { createAudioUpload } from "../../../../DAL/uploads/create-audio-upload";
import { createUpload } from "../../../../DAL/uploads/create-upload";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest, ExpressRequest } from "../../../../types/express";
import { createHandler } from "@pondfm/server-utils";
import crypto from 'crypto';
import { withSubscription } from "../../../../DAL/billing/with/with-subscription";
import { serviceError } from "../../../../utils/service-error";
import { withUpload } from "../../../../DAL/uploads/with/with-upload";
import { withTrack } from "../../../../DAL/posts/with/with-track";
import { TSession } from "../../../../types/session";
import path from "path";
import { v4 } from "uuid";
import { createSignedUploadUrl } from "../../../../utils/signed-upload";
import { createCanonicalPost } from "../../../../DAL/posts/create-canonical-post";
import { ServiceErrorResponse, ServiceSuccessResponse } from "../../../../types/service-response";

export const createUploadHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const data = req.body;
    const session = req.session;

    //Make sure the file size is within the quota of the user.
    const quotaVerificationResult = await verifyUploadQuota(data.size, session);
    if (quotaVerificationResult.success !== true) {
      return res.status(409).json({
        error: quotaVerificationResult.error,
      })
    }

    const uploadToken = await db.transaction(async trx => {
      const id = v4();
      const extname = path.extname(data.filename);
      const filename = `${id}${extname}`;
      const key = `uploads/${filename}`;
      const upload = await createUpload(trx, {
        id,
        filename,
        key,
        originalFilename: data.filename,
        size: data.size,
        mimeType: data.mimeType,
      });

      const audio = await createAudioUpload(trx, { uploadId: upload.id, bitrate: data.bitRate });
      await createCanonicalPost(trx, {
        track: {
          title: data.title,
          genre: data.genre,
          moods: data.moods,
          authorId: session.user.id,
          audioId: upload.id,
        } as any
      });

      const code = crypto.randomBytes(32).toString('base64url');
      await trx(tablenames.uploadTokens).insert({
        upload_id: audio.upload_id,
        user_id: session.user.id,
        code,
        expires_at: db.raw("CURRENT_TIMESTAMP + INTERVAL '1h'"),
      });


      return {
        code, key
      };
    });

    const signedUrl = await createSignedUploadUrl(uploadToken.key, data.mimeType, data.size);
    return res.status(200).json({
      uploadUrl: signedUrl,
      code: uploadToken.code,
    });
  }
)

async function verifyUploadQuota(uploadedSize: number, session: TSession) {
  const quotaQuery = withSubscription(db.queryBuilder());
  withTrack(quotaQuery);
  withUpload(quotaQuery);
  const quota = await quotaQuery
    .from('subscription')
    .where({ 'subscription.user_id': session.user.id })
    .select(
      'subscription.storage_quota_mib',
      db.raw(`
          (SELECT SUM(size)::bigint 
          FROM upload 
          WHERE upload.id 
          IN (SELECT primary_audio_id FROM track WHERE track.author_id = subscription.user_id))
          AS uploaded_size_mib`)
    )
    .first();

  if (quota.storage_quota_mib && (BigInt(quota.uploaded_size_mib) + BigInt(uploadedSize) > BigInt(quota.storage_quota_mib))) {
    return {
      success: false,
      error: serviceError.upload.quotaExceeded
    } as ServiceErrorResponse;
  }

  return {
    success: true
  } as ServiceSuccessResponse;
}