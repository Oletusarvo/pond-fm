import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest, TRequest } from "../../../../types/request";
import { tablenames } from "../../../../tablenames";
import { db } from "../../../../db-config";
import { TUploadFolder } from "@pondfm/app-shared/dist/types/upload-folder";

export const deleteUserHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  await db.transaction(async (trx) => {
    await trx(tablenames.users).where({ id: session.user.id }).update({
      status: "deleted",
      deleted_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

    //Mark all upload folders as deleted.
    await trx(tablenames.uploadFolders)
      .where({ author_id: session.user.id })
      .update({
        status: "deleted",
      } as TUploadFolder);
  });
  return res.end();
});
