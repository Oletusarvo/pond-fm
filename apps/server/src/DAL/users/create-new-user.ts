import { TUser } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";

/**Creates a new user. */
export async function createNewUser(
  ctx: DBContext,
  config: { user: { email: string; username: string } },
) {
  const [user] = await ctx(tablenames.users)
    .insert({
      email: config.user.email,
      username: config.user.username,
      status: "pending_verification",
    } as Partial<TUser>)
    .returning("id");
  return user;
}
