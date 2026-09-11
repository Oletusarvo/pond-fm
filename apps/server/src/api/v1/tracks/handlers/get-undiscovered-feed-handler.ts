import { db } from "../../../../db-config";
import { getUndiscoveredPosts } from "../../../../DAL/posts/get-undiscovered-posts";

import { asArray } from "../../../../utils/as-array";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns the main track feed. */
export const getUndiscoveredFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const cursor = getCursor(req);
    const { genres, moods } = req.query as {
      genres?: string[] | string;
      moods?: string[] | string;
    };
    const session = req.session || null;
    const result = await getUndiscoveredPosts(db, {
      cursor,
      session,
      genres: asArray(genres),
      moods: asArray(moods),
    });
    return res.json(result);
  },
);
