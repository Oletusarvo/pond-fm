import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function activateUserById(ctx: DBContext, config: { user: { id: string } }) {
  await ctx(tablenames.users)
    .where({ id: config.user.id })
    .update({
      status: 'active'
    });
}