import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function withFollowerCount(query: Knex.QueryBuilder
) {
  query.with('follower_count', qb => {
    qb
      .from({ user: tablenames.users })
      .select(
        'user.id as user_id',
        db.raw(`(SELECT COUNT(*) FROM ?? f WHERE f.followee_id = "user".id) AS count`, [tablenames.followers]))

  });
}