import { TUser } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";
import { Knex } from "knex";
import { findUserById } from "./find-user-by-id";

/**Creates a new user. */
export async function createNewUser(
  ctx: Knex.Transaction,
  config: { user: Partial<TUser> & Pick<TUser, "audius_user_id"> },
) {
  const [user] = await ctx(tablenames.users)
    .insert({
      ...config.user,
      terms_accepted_at: new Date(),
      status: "active",
    })
    .onConflict(["audius_user_id"])
    .merge()
    .returning("audius_user_id");

  await ctx(tablenames.subscriptions)
    .insert({
      plan_id: "free",
      user_id: user.audius_user_id,
    })
    .onConflict()
    .ignore();

  return (await findUserById(ctx, { audius_user_id: user.audius_user_id })) as Pick<
    TUser,
    "audius_user_id"
  >;
}
