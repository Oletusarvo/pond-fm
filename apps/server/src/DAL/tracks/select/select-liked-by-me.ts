import { TSession } from "@pondfm/app-shared";
import { Knex } from "knex";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";

export function selectLikedByMe(query: Knex.QueryBuilder, session?: TSession) {
  const columnName = "liked_by_me";

  if (session) {
    query.select(
      db.raw(
        "(EXISTS (SELECT 1 FROM ?? AS likes WHERE likes.user_id = ? AND likes.track_id = track.audius_track_id)) AS ??",
        [tablenames.likes, session.user.audius_user_id, columnName],
      ),
    );
  } else {
    query.select(db.raw("FALSE AS ??", [columnName]));
  }
}
