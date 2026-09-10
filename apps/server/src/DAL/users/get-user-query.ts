import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { fromUsers } from "./from/from-users";

/**Returns the base for user queries.*/
export function getUserQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  fromUsers(query);
  return query;
}
