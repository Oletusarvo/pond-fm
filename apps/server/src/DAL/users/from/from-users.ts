import { Knex } from "knex";
import { tablenames } from "../../../tablenames";

export function fromUsers(query: Knex.QueryBuilder) {
  query.from({ users: tablenames.users });
}