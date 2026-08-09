import { db } from "../../../../db-config";
import { createAudioUpload } from "../../../../DAL/uploads/create-audio-upload";
import { createUpload } from "../../../../DAL/uploads/create-upload";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest, ExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import crypto from 'crypto';
import { createJWT } from "../../../../utils/jwt";
import { createSignedUploadUrl } from "../../../../utils/create-signed-upload-url";
import { keyof } from "zod";

export const createUploadHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const data = req.body;
    const audio = await db.transaction(async trx => {

      const upload = await createUpload(trx, {
        filename: data.filename,
        size: data.size,
        mimeType: data.mimeType,
      });
      const audio = await createAudioUpload(trx, { uploadId: upload.id, bitrate: data.bitRate });
      const code = crypto.randomBytes(32).toString('base64url');
      const session = req.session;
      await trx(tablenames.uploadTokens).insert({
        upload_id: audio.upload_id,
        user_id: session.user.id,
        code,
        expires_at: Date.now() + 1000 * 60 * 60,
      });
      const payload = {
        uploadId: audio.upload_id,
        userId: session.user.id,
        code,
      } as ExpressRequest['uploadToken'];

      return {
        ...audio,
        filename: upload.filename,
        token: createJWT(payload),
      }
    });

    const key = `uploads/${audio.filename}`;
    const signedUrl = createSignedUploadUrl(key, data.mimeType);
    return res.status(200).json({
      uploadUrl: signedUrl,
      key,
      token: audio.token,
    });
  }
)