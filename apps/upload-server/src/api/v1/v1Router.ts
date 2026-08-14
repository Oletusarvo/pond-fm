import { createBodyParser, getRouter } from "@pondfm/server-utils";
import { verifyStreamUrlSignature } from "./middleware/verify-stream-url-signature";
import { uploadFileHandler } from "./handlers/upload-file-handler";
import { streamFileHandler } from "./handlers/stream-file-handler";
import { verifyUploadUrlSignature } from "./middleware/verify-upload-url-signature";
import { deleteFileshandler } from "./handlers/delete-files-handler";
import { verifyDeleteUrlSignature } from "./middleware/verify-delete-url-signature";
import z from "zod";

const router = getRouter();

router.put('/upload/*key', verifyUploadUrlSignature, uploadFileHandler);
router.get('/stream/*key', verifyStreamUrlSignature, streamFileHandler);
router.delete('/upload', verifyDeleteUrlSignature, createBodyParser(z.object({
  keys: z.array(z.string())
})), deleteFileshandler);
export { router as v1Router };