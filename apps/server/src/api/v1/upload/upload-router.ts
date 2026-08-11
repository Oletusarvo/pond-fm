
import { getRouter } from "../../../utils/get-router";
import { checkAuth } from "../../middleware/check-auth";
import { completeUploadHandler } from "./handlers/complete-upload-handler";
import { createUploadHandler } from "./handlers/create-upload-handler";
import { upload } from "../../../multer-config";
import { createBodyParser } from "../../../utils/create-body-parser";
import { createUploadSchema } from "../../../schemas/create-upload-schema";
import { completeUploadSchema } from "../../../schemas/complete-upload-schema";
import { uploadFileHandler } from "./handlers/upload-file-handler";
import { verifyUploadToken } from "./middleware/verify-upload-token";
import { verifyUploadHeaderSignature } from "./middleware/verify-upload-header-signature";

const router = getRouter();


router.post('/create', checkAuth(), createBodyParser(createUploadSchema), createUploadHandler);
router.post('/complete/:code', checkAuth(), completeUploadHandler);
router.post('/*key', checkAuth(), verifyUploadHeaderSignature, uploadFileHandler);

export { router as uploadRouter }