import { getFollowedPosts } from "../../../../DAL/posts/get-followed-posts";
import { db } from "../../../../db-config";

import { asArray } from "../../../../utils/as-array";
import { createHandler } from "@pondfm/server-utils";
import { getCursor } from "../../../../utils/get-cursor";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns tracks posted by users the currently authenticated user is following */
export const getFollowedFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const session = req.session;
    const cursor = getCursor(req);
    const result = await getFollowedPosts(db, {
      session,
      cursor,
      genres: asArray(req.query.genres as string[]),
      moods: asArray(req.query.moods as string[]),
    });
    return res.json(result);
  },
);
