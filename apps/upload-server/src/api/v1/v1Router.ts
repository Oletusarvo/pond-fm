import { getRouter } from "@pondfm/server-utils";
import { verifyStreamUrlSignature } from "./middleware/verify-stream-url-signature";
import { uploadFileHandler } from "./handlers/upload-file-handler";
import { streamFileHandler } from "./handlers/stream-file-handler";
import { verifyUploadUrlSignature } from "./middleware/verify-upload-url-signature";

const router = getRouter();

router.put('/upload/*key', verifyUploadUrlSignature, uploadFileHandler);
router.get('/stream/*key', verifyStreamUrlSignature, streamFileHandler);

export { router as v1Router };