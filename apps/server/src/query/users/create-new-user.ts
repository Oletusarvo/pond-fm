import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function createNewUser(ctx: DBContext, config: { user: { email: string; username: string } }) {
  const [user] = await ctx(tablenames.users)
    .insert(
      {
        email: config.user.email,
        username: config.user.username,
        user_status_id: db
          .select('id')
          .from(tablenames.userStatuses)
          .where({ label: 'pending' })
          .limit(1),
      }
    )
    .returning('id');
  return user;
}