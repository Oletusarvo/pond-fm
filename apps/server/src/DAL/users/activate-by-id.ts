import { TUser } from "@pondfm/app-shared";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

/**Activates a user by id. */
export async function activateUserById(ctx: DBContext, config: { id: string }) {
  await ctx(tablenames.users)
    .where({ id: config.id, status: "pending_verification" } as Partial<TUser>)
    .update({
      status: "active",
    } as Partial<TUser>);
}
