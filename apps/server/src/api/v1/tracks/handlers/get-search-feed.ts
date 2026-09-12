import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";
import { db } from "../../../../db-config";
import { onlyCanonicalPosts } from "../../../../DAL/posts/utils/only-canonical-posts";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { getCursor } from "../../../../utils/get-cursor";
import { applyCursor } from "../../../../DAL/posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";

export const getSearchFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const q = req.query.q as string;

    if (q) {
      const session = req.session;
      const query = getUndistinctPostQuery(db, session);
      onlyCanonicalPosts(query);
      selectTrack(query);
      selectPost(query);
      query.where(function () {
        const str = `%${q}%`;
        this.whereILike("track.title", str).orWhereILike(
          "track_author.username",
          str,
        );
      });
      const cursor = getCursor(req);
      applyCursor(query, {
        cursor,
        timestampColumn: "track.created_at",
        idColumn: "track.id",
        dir: "desc",
      });
      const tracks = await resolveQueryWithCursor(query, { pageSize: 10 });
      return res.json(tracks);
    }

    return res.json({ items: [], cursor: null });
  },
);
