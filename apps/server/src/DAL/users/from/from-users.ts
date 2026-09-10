import { Knex } from "knex";
import { tablenames, viewnames } from "../../../tablenames";

/**Adds a from-caluse to the provided query, selecting from viewnames.users aliased as "users". */
export function fromUsers(query: Knex.QueryBuilder) {
  query.from({ users: viewnames.users });
}
