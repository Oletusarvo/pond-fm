import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";

import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

export const deleteTrackHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const session = req.session;
  const rowsAffected = await db(tablenames.uploadFolders)
    .where({
      author_id: session.user.id,
      id: db
        .select("upload_folder_id")
        .from(tablenames.uploads)
        .where({
          id: db
            .select("primary_audio_id")
            .from(tablenames.tracks)
            .where({ id: req.params.trackId })
            .limit(1),
        })
        .limit(1),
    })
    .andWhereNot(function () {
      this.where({ status: "deleted" }).orWhere({ status: "pending_deletion" });
    })
    .update({
      status: "deleted",
      deleted_at: db.fn.now(),
      updated_at: db.fn.now(),
    });

  const status = rowsAffected > 0 ? 200 : 204;
  return res.status(status).end();
});
