import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function withAuthor(query: Knex.QueryBuilder) {
  query.with("author_json", (qb) => {
    qb.select(
      "audius_user_id",
      db.raw("JSON_BUILD_OBJECT('audius_user_id', audius_user_id) AS json"),
    ).from(tablenames.users);
  });
}
