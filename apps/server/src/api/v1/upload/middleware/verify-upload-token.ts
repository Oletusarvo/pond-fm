import {
  createMiddleware,
  ExpressRequest,
  tryCatch,
  verifyJWT,
} from "@pondfm/server-utils";
import {
  TAuthenticatedRequest,
  WithUploadToken,
} from "../../../../types/request";

export const verifyUploadToken = createMiddleware(
  async (req: WithUploadToken<TAuthenticatedRequest>, res, next) => {
    const token = req.headers.authorization?.split(" ").at(1);

    if (!token) {
      return res.status(401).end();
    }
    const [payload, err] = await tryCatch(
      () =>
        verifyJWT(
          token,
        ) as WithUploadToken<TAuthenticatedRequest>["uploadToken"],
    );

    if (err) {
      return res.status(401).end();
    }
    const session = req.session;
    if (payload.userId !== session.user.id) {
      return res.status(401).end();
    }
    req.uploadToken = payload;
    next();
  },
);
