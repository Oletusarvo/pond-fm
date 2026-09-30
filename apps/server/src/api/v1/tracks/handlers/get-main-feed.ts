import { db } from "../../../../db-config";
import { getNewPosts } from "../../../../DAL/posts/get-new-posts";

import { asArray } from "../../../../utils/as-array";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { getFeedHandler } from "../../../../utils/get-feed-handler";
import { getNewTracks } from "../../../../DAL/tracks/get-new-tracks";

/**Returns a feed of tracks sorted by newest first. */
export const getMainFeedHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const cursor = getCursor(req);
  const { genres, moods } = req.query as {
    genres?: string[];
    moods?: string[];
  };
  const session = req.session;
  const result = await getFeedHandler(
    async () =>
      await getNewTracks(db, {
        session,
        cursor,
        genres: asArray(genres),
        moods: asArray(moods),
      }),
  );
  return res.json(result);
});
