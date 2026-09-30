import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { getUndistinctPostQuery } from "../../../../DAL/posts/get-undistinct-post-query";
import { db } from "../../../../db-config";
import { onlyCanonicalTracks } from "../../../../DAL/tracks/filter/only-canonical-tracks";
import { selectTrack } from "../../../../DAL/posts/select/select-track";
import { selectPost } from "../../../../DAL/posts/select/select-post";
import { getCursor } from "../../../../utils/get-cursor";
import { applyCursor } from "../../../../DAL/posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../../../../DAL/posts/utils/resolve-query-with-cursor";
import { getDistinctPostQuery } from "../../../../DAL/posts/get-distinct-post-query";

export const getSearchFeedHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const q = req.query.q as string;

  if (q) {
    const params = q.split(" ");
    const session = req.session;
    const query = getDistinctPostQuery(db, session);
    onlyCanonicalTracks(query);
    selectTrack(query);
    selectPost(query);
    params.forEach((param) => {
      query.where(function () {
        const str = `%${param}%`;
        this.whereILike("track.title", str).orWhereILike("track_author.username", str);
      });
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
});
