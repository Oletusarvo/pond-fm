import { Knex } from "knex";
import { tablenames } from "../../../tablenames";
/**Applies a FROM-clause for auth tokens, aliasing the table as auth_tokens. */
export function fromAuthTokens(query: Knex.QueryBuilder) {
  query.from({ auth_tokens: tablenames.authTokens });
}