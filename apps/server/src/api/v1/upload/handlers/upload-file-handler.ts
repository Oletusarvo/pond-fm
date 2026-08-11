import { db } from "../../../../db-config";
import { createUpload } from "../../../../DAL/uploads/create-upload";
import { updateUpload } from "../../../../DAL/uploads/update-upload";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";
import { createWriteStream } from "fs";
import path from "path";

/**@todo set the upload token to used. */
export const uploadFileHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const key = req.params.key as string[];
    const file = createWriteStream(path.join(process.cwd(), key.join('/')), {
      highWaterMark: 64
    });
    req.pipe(file);

    file.on('finish', () => {
      res.writeHead(200);
      res.end();
    });

    file.on('error', () => {
      res.writeHead(500);
      res.end();
    });
  }
)