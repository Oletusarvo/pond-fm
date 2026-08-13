import { createMiddleware, ExpressRequest, ExpressResponse } from "@pondfm/server-utils";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";
import { WithContentMetadata } from "../../../types/express";
import { compareSignature } from "@pondfm/crypto";

export const verifyUploadUrlSignature = createMiddleware(
  async (req: ExpressRequest & WithContentMetadata, res: ExpressResponse, next) => {
    const signature = req.query['X-Signature'] as string;
    const contentType = req.headers["content-type"];
    const contentLength = req.headers["content-length"];
    const clientId = req.query['X-Client-ID'] as string;

    const key = req.params.key as string[];
    const keyString = key.join('/');

    const command = {
      'content-type': contentType,
      'content-length': contentLength,
      key: keyString,
      clientId,
    }

    const client = await db(tablenames.clients).where({ id: clientId }).select('secret_key').first() as { secret_key: string };
    if (!client) {
      return res.status(401).json({
        error: 'no-client'
      });
    }

    const signatureValid = compareSignature(command, signature, client.secret_key)
    if (!signatureValid) {
      return res.status(401).json({
        error: 'signature-invalid'
      });
    }

    req.contentMetadata = {
      contentLength: Number(command['content-length']),
      contentType: command['content-type'],
      key: keyString,
      clientId,
    };
    next();
  }
)