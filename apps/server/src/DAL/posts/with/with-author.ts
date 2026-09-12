import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
import { db } from "../../../db-config";

export function withAuthor(query: Knex.QueryBuilder) {
  query.with("author_json", (qb) => {
    qb.select(
      "id",
      "username",
      db.raw("JSON_BUILD_OBJECT('id', id, 'username', username) AS json"),
    ).from(tablenames.users);
  });
}
