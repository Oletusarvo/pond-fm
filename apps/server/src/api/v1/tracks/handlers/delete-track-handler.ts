import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const deleteTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const rowsAffected = await db(tablenames.tracks)
      .where({ id: req.params.trackId as string, author_id: session.user.id })
      .update({ status: 'deleted' });
    const status = rowsAffected > 0 ? 200 : 204;
    return res.status(status).end();
  }
)