import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";

export async function findUserByEmail(ctx: DBContext, config: { user: { email: string } }) {
  const query = getUserQuery(ctx);
  query.select('users.*');
  return await query.where({ email: config.user.email }).first();
}