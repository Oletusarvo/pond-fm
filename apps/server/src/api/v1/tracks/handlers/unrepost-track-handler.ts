import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { createHandler } from "../../../../utils/create-handler";

export const unrepostTrackHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    await postService.unrepostTrack(db, {
      editor: { id: session.user.id },
      track: { id: req.body.trackId },
    });
    return res.end();
  },
);
