import { db } from "../../../../db-config";
import { getAuthorPosts } from "../../../../DAL/posts/get-author-posts";
import { createHandler } from "@pondfm/server-utils";
import { getCursor } from "../../../../utils/get-cursor";
import { TAuthenticatedRequest } from "../../../../types/request";

/**Returns a feed of tracks posted by a specific user. */
export const getAuthorFeed = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const { authorId } = req.params as { authorId: string };
    const session = req.session;
    const cursor = getCursor(req);
    const result = await getAuthorPosts(db, {
      authorId,
      session,
      cursor,
    });
    return res.json(result);
  },
);
