import { db } from "../../../../db-config";
import { createAudioUpload } from "../../../../DAL/uploads/create-audio-upload";
import { createUpload } from "../../../../DAL/uploads/create-upload";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest, ExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import crypto from 'crypto';
import { createJWT } from "../../../../utils/jwt";

export const createUploadHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const audio = await db.transaction(async trx => {
      const data = req.body;
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

    return res.status(200).json({
      uploadUrl: 'http://localhost:3002/api/v1/upload/',
      key: `uploads/${audio.filename}`,
      token: audio.token,
    });
  }
)