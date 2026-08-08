import { getFollowedPosts } from "../../../../DAL/posts/get-followed-posts";
import { db } from "../../../../db-config";
import { AuthenticatedExpressRequest } from "../../../../types/express";
import { asArray } from "../../../../utils/as-array";
import { createHandler } from "../../../../utils/create-handler";
import { getCursor } from "../../../../utils/get-cursor";

export const getFollowedFeedHandler = createHandler(
  async (req: AuthenticatedExpressRequest, res) => {
    const session = req.session;
    const cursor = getCursor(req);
    const result = await getFollowedPosts(db, {
      session,
      cursor,
      genres: asArray(req.query.genres as string[]),
      moods: asArray(req.query.moods as string[])
    });
    return res.json(result);
  }
)