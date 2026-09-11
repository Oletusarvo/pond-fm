import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { db } from "../../../../db-config";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { fromDistinctPost } from "../../../../DAL/posts/from/from-distinct-post";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";
import { applyCursor } from "../../../../DAL/posts/utils/apply-cursor";
import { getCursor } from "../../../../utils/get-cursor";
import { getDistinctPostQuery } from "../../../../DAL/posts/get-distinct-post-query";

/**Returns tracks reposted by a user. */
export const getAuthorRepostedFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const authorId = req.params.authorId;
    const query = getDistinctPostQuery(db, req.session);
    selectPost(query);
    selectTrack(query);
    fromDistinctPost(query);
    query
      .whereRaw("post.author_id <> track_author.id")
      .andWhere({ "post.author_id": authorId });
    const cursor = getCursor(req);
    applyCursor(query, {
      dir: "desc",
      timestampColumn: "created_at",
      idColumn: "post.id",
      cursor,
    });
    const tracks = await resolveQueryWithCursor(query, { pageSize: 10 });
    return res.json(tracks);
  },
);
