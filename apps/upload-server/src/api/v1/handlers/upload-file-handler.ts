import path from "path";
import { createHandler, ExpressRequest, ExpressResponse, loadEnvVariable } from "@pondfm/server-utils";
import { createWriteStream } from "fs";
import { WithContentMetadata } from "../../../types/express";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";

const UPLOAD_DEST = loadEnvVariable('UPLOAD_DEST');

export const uploadFileHandler = createHandler(
  async (req: ExpressRequest & WithContentMetadata, res: ExpressResponse) => {

    const contentMetadata = req.contentMetadata;
    const key = req.contentMetadata.key;
    console.log('Processing file', key)
    const file = createWriteStream(path.join(UPLOAD_DEST, key), { highWaterMark: 64 });
    req.pipe(file);
    await db(tablenames.uploads)
      .insert({
        status: 'pending',
        client_id: req.contentMetadata.clientId,
        key,
        mime_type: contentMetadata.contentType,
        size: contentMetadata.contentLength,
      })

    file.on('finish', () => {
      db(tablenames.uploads).where({ key }).update({ status: 'ready' })
        .catch((err) => {
          console.log('Failed to mark file as ready!', err.stack);
        });
      res.writeHead(200);
      res.end();
    });

    file.on('error', () => {
      db(tablenames.uploads).where({ key }).update({ status: 'failed' })
        .catch(err => console.log('Failed to mark file as failed!', err.stack));

      res.writeHead(500);
      res.end();
    });
  }
)