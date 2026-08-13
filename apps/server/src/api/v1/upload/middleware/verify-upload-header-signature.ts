import { compareSignature } from "@pondfm/crypto";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createMiddleware } from "../../../../utils/create-handler";

export const verifyUploadHeaderSignature = createMiddleware(
  async (req: AuthenticatedExpressRequest, res, next) => {
    const signature = req.query['X-Signature'] as string;
    const key = req.params.key as string[];

    const signatureValid = compareSignature({
      key: key.join('/'),
      'content-type': req.headers['content-type'] as string,
      'content-length': req.headers['content-length'] as string,
    }, signature, process.env.URL_SIGN_SECRET);

    if (!signatureValid) {
      console.log('Signature invalid!', req.headers);
      return res.status(401).end();
    }

    next();
  }
)