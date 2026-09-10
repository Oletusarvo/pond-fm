import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { fromAuthTokens } from "./from/from-auth-tokens";
/**Returns a query on the auth tokens table (aliased as auth_tokens) and joining the relevant user to the result. */
export function getAuthTokenQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  query.join({ user: tablenames.users }, "user.id", "auth_tokens.user_id");
  fromAuthTokens(query);
  return query;
}
