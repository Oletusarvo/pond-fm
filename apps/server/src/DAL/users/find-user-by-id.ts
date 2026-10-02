import { TUser, TUserRestricted } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectUser } from "./select/select-user";

/**Returns a user by their email. */
export async function findUserById(ctx: DBContext, config: { id: string }) {
  const query = getUserQuery(ctx);
  query.join(
    { subscription: viewnames.subscriptions },
    "subscription.user_id",
    "users.id",
  );

  selectUser(query);
  query.select(
    db.raw(`
      JSON_BUILD_OBJECT(
      'plan_id', subscription.plan_id, 
      'status', subscription.status,
      'current_period_start', subscription.current_period_start,
      'current_period_end', subscription.current_period_end,
      'override_started_at', subscription.override_started_at,
      'override_expires_at', subscription.override_expires_at,
      'unique_listeners_threshold', subscription.unique_listeners_threshold
      ) AS subscription`),
  );

  return (await query
    .where({ "users.id": config.id })
    .first()) as TUserRestricted;
}
