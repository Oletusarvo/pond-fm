import { TPost, TSession } from "@pondfm/app-shared";
import { tablenames, viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";

import { withAuthor } from "./with/with-author";
import { withMoods } from "./with/with-moods";
import { withStats } from "./with/with-stats";

export function getPostQuery(ctx: DBContext, session?: TSession) {
  const query = ctx.queryBuilder<any, TPost>();
  withAuthor(query);
  withMoods(query);
  withStats(query, session);
  query
    .join({ author: "author_json" }, "author.id", "post.author_id")
    .join({ track: viewnames.tracks }, "track.id", "post.track_id")
    .join({ stats: "stats" }, "stats.track_id", "track.id")
    .join({ track_author: "author_json" }, "track_author.id", "track.author_id")
    .join({ track_genre: tablenames.genres }, "track_genre.id", "track.genre_id")
    .where({ "track.status": "active" });

  return query;
}
