import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TNotification } from "../../types/notification-type";
import { getLookupQuery } from "../util/get-lookup-query";

/**Creates a new notification. */
export async function createNotification(
  ctx: DBContext,
  config: { notification: TNotification },
) {
  const { type, ...rest } = config.notification;
  await ctx(tablenames.notifications).insert({
    ...rest,
    type,
  });
}
