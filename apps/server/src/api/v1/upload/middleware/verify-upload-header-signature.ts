import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createMiddleware } from "../../../../utils/create-handler";
import { compareSignature } from "../../../../utils/create-signed-upload-url";
import { verifyJWT } from "../../../../utils/jwt";
import { tryCatch } from "../../../../utils/try-catch";

export const verifyUploadHeaderSignature = createMiddleware(
  async (req: AuthenticatedExpressRequest, res, next) => {
    const signature = req.query.signature as string;
    const key = req.params.key as string[];

    console.log(req.params.key)
    const signatureValid = compareSignature({
      key: key.join('/'),
      'content-type': req.headers['content-type'] as string,
      'content-length': req.headers['content-length'] as string,
    }, signature);

    if (!signatureValid) {
      console.log('Signature invalid!', req.headers);
      return res.status(401).end();
    }

    next();
  }
)