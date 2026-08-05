import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const updateTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const track = req.body;
    await db.transaction(async trx => {
      await postService.updateTrack(trx, {
        track: {
          ...track,
          id: req.params.trackId
        },
        editor: {
          id: session.user.id
        }
      });
    });
    return res.end();
  }
)