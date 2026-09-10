import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { db } from "../../../../db-config";
import { tablenames } from "../../../../tablenames";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { fromDistinctPost } from "../../../../DAL/posts/from/from-distinct-post";
import { applyCursor } from "../../../../DAL/posts/utils/apply-cursor";
import { getCursor } from "../../../../utils/get-cursor";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";
import { getDistinctPostQuery } from "../../../../DAL/posts/get-distinct-post-query";
import { onlyCanonicalPosts } from "../../../../DAL/posts/utils/only-canonical-posts";
import { getPostQuery } from "../../../../DAL/posts/get-post-query";
import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";

export const getAuthorLikedFeedHandler = createHandler(
  async (req: TAuthenticatedRequest, res) => {
    const query = getUndistinctPostQuery(db, req.session);
    onlyCanonicalPosts(query);
    query.whereIn(
      "track.id",
      db
        .select("track_id")
        .from(tablenames.likes)
        .where({ user_id: req.params.authorId }),
    );
    selectPost(query);
    selectTrack(query);
    applyCursor(query, {
      cursor: getCursor(req),
      dir: "desc",
      timestampColumn: "track.created_at",
      idColumn: "track.id",
    });
    const tracks = await resolveQueryWithCursor(query, { pageSize: 10 });
    return res.json(tracks);
  },
);
