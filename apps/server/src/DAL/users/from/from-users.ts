import { Knex } from "knex";
import { tablenames, viewnames } from "../../../tablenames";

export function fromUsers(query: Knex.QueryBuilder) {
  query.from({ users: viewnames.users });
}