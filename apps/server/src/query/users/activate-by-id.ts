import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getLookupQuery } from "../util/get-lookup-query";

export async function activateUserById(ctx: DBContext, config: { user: { id: string } }) {
  await ctx(this.tablename.data)
    .where({ id: config.user.id })
    .update({
      status: 'active'
    });
}