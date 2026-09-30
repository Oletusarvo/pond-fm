import { TSession } from "@pondfm/app-shared";
import { Knex } from "knex";
import { db } from "../../../db-config";
import { tablenames, viewnames } from "../../../tablenames";

export function selectRepostedByMe(query: Knex.QueryBuilder, session?: TSession) {
  const columnName = "reposted_by_me";

  if (session) {
    query.select(
      db.raw(
        `(EXISTS 
          (SELECT 1 FROM ?? reposts 
            WHERE reposts.author_id = ?
            AND 
            reposts.track_id = track.audius_track_id
            AND
            track.author_id <> ?
          )) AS ??`,
        [tablenames.posts, session.user.audius_user_id, session.user.audius_user_id, columnName],
      ),
    );
  } else {
    query.select(db.raw("FALSE AS ??", [columnName]));
  }
}
