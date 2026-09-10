import { createUploadSchema } from "@pondfm/app-shared";
import { checkAuth } from "../../middleware/check-auth";
import { completeUploadHandler } from "./handlers/complete-upload-handler";
import { createUploadHandler } from "./handlers/create-upload-handler";
import { uploadFileHandler } from "./handlers/upload-file-handler";
import { verifyUploadHeaderSignature } from "./middleware/verify-upload-header-signature";
import { getRouter, createBodyParser } from "@pondfm/server-utils";

const router = getRouter();

/**
 * POST /upload/create
 * @summary Creates a pending upload of a track.
 * @returns An upload url and a code to use when completing the upload.
 * @tags Uploads
 */
router.post(
  "/create",
  checkAuth(),
  createBodyParser(createUploadSchema),
  createUploadHandler,
);
/**
 * POST /uploads/complete/:code
 * @summary Completes an upload.
 * @tags Uploads
 */
router.post("/complete/:code", checkAuth(), completeUploadHandler);
/**
 * PUT /uploads/*key
 * @summary Uploads a file locally.
 * @tags Uploads
 * @deprecated This endpoint is no longer maintained; upload to a third-party object storage using the upload url returned by /uploads/create instead.
 */
router.put(
  "/*key",
  checkAuth(),
  verifyUploadHeaderSignature,
  uploadFileHandler,
);

export { router as uploadRouter };
