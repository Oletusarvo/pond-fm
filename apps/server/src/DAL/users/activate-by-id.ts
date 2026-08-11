import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function activateUserById(ctx: DBContext, config: { id: string }) {
  await ctx(tablenames.users)
    .where({ id: config.id, status: 'pending' })
    .update({
      status: 'active'
    });
}