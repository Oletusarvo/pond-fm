import path from "path";
import { createHandler, ExpressRequest, ExpressResponse, loadEnvVariable } from "@pondfm/server-utils";
import { createReadStream } from 'fs';
import { WithContentMetadata } from "../../../types/express";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";

const UPLOAD_DEST = loadEnvVariable('UPLOAD_DEST');
export const streamFileHandler = createHandler(
  async (req: WithContentMetadata & ExpressRequest, res: ExpressResponse) => {

    const range = req.headers.range;
    const keyArray = req.params.key as string[];
    const key = keyArray.join('/');
    console.log('Serving ', key);
    const filePath = path.join(UPLOAD_DEST, key);
    const file = await db(tablenames.uploads).where({ key }).select('size', 'mime_type').first() as { size: string; mime_type: string };
    if (!file) {
      return res.status(404).json({
        error: 'media-not-found'
      });
    }

    const fileSize = Number(file.size);

    // Browser requested the entire file
    if (!range) {
      res.writeHead(200, {
        'Content-Type': file.mime_type,
        'Content-Length': fileSize,
        'Accept-Ranges': 'bytes',
      });

      createReadStream(filePath).pipe(res);
      return;
    }

    // Example: "bytes=1048576-"
    const [startString, endString] = range.replace('bytes=', '').split('-');

    const start = Number(startString);
    const end = endString ? Number(endString) : fileSize - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || end >= fileSize) {
      res.status(416).setHeader('Content-Range', `bytes */${fileSize}`);
      res.end();
      return;
    }

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': file.mime_type,
    });


    const stream = createReadStream(filePath, {
      start, end
    });
    stream.pipe(res);
  }
)