import { AuthenticatedExpressRequest, ExpressRequest } from "../../../../types/express";
import { createMiddleware } from "../../../../utils/create-handler";
import { verifyJWT } from "../../../../utils/jwt";
import { tryCatch } from "../../../../utils/try-catch";

export const verifyUploadToken = createMiddleware(
  async (req: AuthenticatedExpressRequest, res, next) => {
    const token = req.headers.authorization?.split(' ').at(1);

    if (!token) {
      return res.status(401).end();
    }
    const [payload, err] = await tryCatch(() => verifyJWT(token) as ExpressRequest['uploadToken']);
    if (err) {
      return res.status(401).end();
    }
    const session = req.session;
    if (payload.userId !== session.user.id) {
      return res.status(401).end();
    }
    req.uploadToken = payload;
    next();
  }
)