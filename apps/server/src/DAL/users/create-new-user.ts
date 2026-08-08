import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";

export async function createNewUser(ctx: DBContext, config: { user: { email: string; username: string } }) {
  const [user] = await ctx(tablenames.users)
    .insert(
      {
        email: config.user.email,
        username: config.user.username,
        status: 'pending',
      }
    )
    .returning('id');
  return user;
}