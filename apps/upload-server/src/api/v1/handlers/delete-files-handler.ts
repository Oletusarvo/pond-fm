import { createHandler, loadEnvVariable, retry } from "@pondfm/server-utils";
import { db } from "../../../db-config";
import { unlink } from 'fs/promises';
import path from "path";
import { tablenames } from "../../../tablenames";
export const deleteFileshandler = createHandler(
  async (req, res) => {
    const keys = req.body.keys;
    const UPLOAD_DEST = loadEnvVariable('UPLOAD_DEST');
    await retry(async () => await db.transaction(async trx => {
      for (const key of keys) {
        await unlink(path.join(UPLOAD_DEST, key));
      }

      await trx(tablenames.uploads).whereIn('key', keys).del();

    }), {
      retries: 5
    })
    return res.end();
  }
)