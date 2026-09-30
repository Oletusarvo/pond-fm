import { TSession } from "@pondfm/app-shared";
import { Knex } from "knex";
import { db } from "../../../db-config";
import { tablenames, viewnames } from "../../../tablenames";

export function selectRepostedByMe(query: Knex.QueryBuilder, session?: TSession) {
  const columnName = "reposted_by_me";

  if (session) {
    query.select(
      db.raw(
        "(EXISTS (SELECT 1 FROM ?? reposts WHERE reposts.author_id = ? AND track.is_canonical = TRUE AND reposts.audius_track_id = track.audius_track_id)) AS ??",
        [viewnames.tracks, session.user.audius_user_id, columnName],
      ),
    );
  } else {
    query.select(db.raw("FALSE AS ??", [columnName]));
  }
}
