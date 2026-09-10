import { createHandler } from "@pondfm/server-utils";
import { createWriteStream } from "fs";
import path from "path";
import { TAuthenticatedRequest } from "../../../../types/request";

/**@todo set the upload token to used. */
export const uploadFileHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const key = req.params.key as string[];
    const file = createWriteStream(path.join(process.cwd(), key.join("/")), {
      highWaterMark: 64,
    });
    req.pipe(file);

    file.on("finish", () => {
      res.writeHead(200);
      res.end();
    });

    file.on("error", () => {
      //Do a cleanup here.
      res.writeHead(500);
      res.end();
    });
  },
);
