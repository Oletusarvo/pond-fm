import { createHandler, loadEnvVariable, retry } from "@pondfm/server-utils";
import { db } from "../../../db-config";
import { unlink } from 'fs/promises';
import path from "path";
import { tablenames } from "../../../tablenames";
export const deleteFileshandler = createHandler(
  async (req, res) => {
    const keys = req.body.keys;
    const UPLOAD_DEST = loadEnvVariable('UPLOAD_DEST');
    console.log('Deleting', keys);
    async () => await db.transaction(async trx => {
      for (const key of keys) {
        await retry(async () => await unlink(path.join(UPLOAD_DEST, key)), {
          retries: 5
        });
      }

      await trx(tablenames.uploads).whereIn('key', keys).del();

    })
    return res.end();
  }
)