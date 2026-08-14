import { compareSignature } from "@pondfm/crypto";
import { createMiddleware } from "@pondfm/server-utils";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";

export const verifyDeleteUrlSignature = createMiddleware(
  async (req, res, next) => {
    const signature = req.query['X-Signature'] as string;
    const clientId = req.query['X-Client-ID'] as string;
    const client = await db(tablenames.clients).where({ id: clientId }).select('secret_key').first();
    const signatureValid = compareSignature({ clientId }, signature, client.secret_key);
    if (!signatureValid) {
      return res.status(401).end();
    }
    next()
  }
)