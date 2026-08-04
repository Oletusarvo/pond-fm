import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";

export async function findUserById(ctx: DBContext, config: { user: { id: string } }) {
  const query = getUserQuery(ctx);
  return await query.where({ 'users.id': config.user.id }).first();
}