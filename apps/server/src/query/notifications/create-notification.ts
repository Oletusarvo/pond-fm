import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TNotification } from "../../types/notification-type";

export async function createNotification(ctx: DBContext, config: { notification: TNotification }) {
  const { type, ...rest } = config.notification;
  await ctx(tablenames.notifications).insert({
    ...rest,
    notification_type_id: db
      .select('id')
      .from(tablenames.notificationTypes)
      .where({ label: type })
      .limit(1),
  });
}