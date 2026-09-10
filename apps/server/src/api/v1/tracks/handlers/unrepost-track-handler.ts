import { postService } from "../../../../container";
import { db } from "../../../../db-config";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import z from "zod";
import { trackInteractionSchema } from "../../../../schemas/track-interaction-schema";

export const unrepostTrackHandler = createHandler(
  async (
    req: TAuthenticatedRequest<z.infer<typeof trackInteractionSchema>>,
    res,
  ) => {
    const session = req.session;
    await postService.unrepostTrack(db, {
      editor: { id: session.user.id },
      track: { id: req.body.trackId },
    });
    return res.end();
  },
);
