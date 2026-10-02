import { TUser } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";
import { Knex } from "knex";
import { findUserById } from "./find-user-by-id";

/**Creates a new user if it doesn't exist. Returns the new user, or the existing one. */
export async function createUserIfNotExists(
  ctx: Knex.Transaction,
  config: { user: Partial<TUser> & Pick<TUser, "id"> },
) {
  const [user] = await ctx(tablenames.users)
    .insert({
      ...config.user,
      terms_accepted_at: new Date(),
      status: "active",
    })
    .onConflict(["id"])
    .merge()
    .returning("id");

  await ctx(tablenames.subscriptions)
    .insert({
      plan_id: "free",
      user_id: user.id,
    })
    .onConflict()
    .ignore();

  return (await findUserById(ctx, { id: user.id })) as Pick<TUser, "id">;
}
