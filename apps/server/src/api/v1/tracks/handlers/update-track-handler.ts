import z from "zod";
import { postService } from "../../../../container";
import { db } from "../../../../db-config";

import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { updateTrackSchema } from "../../../../schemas/update-track-schema";

export const updateTrackHandler = createHandler(
  async (
    req: TAuthenticatedRequest<z.infer<typeof updateTrackSchema>>,
    res,
  ) => {
    const session = req.session;
    const track = req.body;
    await db.transaction(async (trx) => {
      await postService.updateTrack(trx, {
        track: {
          ...track,
          id: req.params.trackId as string,
        },
        editor: {
          id: session.user.id,
        },
      });
    });
    return res.end();
  },
);
