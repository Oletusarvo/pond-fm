import { db } from "../../../../db-config";

import { asArray } from "../../../../utils/as-array";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { getUndiscoveredTracks } from "../../../../DAL/tracks/get-undiscovered-tracks";
import { includeAudiusTrackData } from "../../../../utils/get-feed-handler";

/**Returns the main track feed. */
export const getUndiscoveredTracksHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const cursor = getCursor(req);
    const { genres, moods } = req.query as {
      genres?: string[] | string;
      moods?: string[] | string;
    };
    const session = req.session || null;
    const json = await includeAudiusTrackData(
      async () =>
        await getUndiscoveredTracks(db, {
          session,
          cursor,
          moods: asArray(moods),
          genres: asArray(genres),
        }),
    );
    return res.json(json);
  },
);
