import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function activateUserById(ctx: DBContext, config: { user: { id: string } }) {
  await ctx(this.tablename.data)
    .where({ id: config.user.id })
    .update({
      user_status_id: db
        .select('id')
        .from(this.tablename.status)
        .where({ label: 'active' })
        .limit(1),
    });
}