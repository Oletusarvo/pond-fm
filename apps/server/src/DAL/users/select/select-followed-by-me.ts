import { Knex } from "knex";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";
import { TSession } from "@pondfm/app-shared";

/**Selects the derived followed_by_me-column on the provided query.*/
export function selectFollowedByMe(
  query: Knex.QueryBuilder,
  session?: TSession,
) {
  if (session) {
    query.select(
      db.raw(
        "EXISTS (SELECT 1 FROM ?? followers WHERE followee_id = users.id AND follower_id = ?) as followed_by_me",
        [tablenames.followers, session.user.id],
      ),
    );
  }
}
