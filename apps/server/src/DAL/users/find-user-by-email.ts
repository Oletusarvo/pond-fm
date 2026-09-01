import { TUser, TUserRestricted } from "@pondfm/app-shared";
import { db } from "../../db-config";
import { viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectUnseenNotificationCount } from "./select/select-notification-count";
import { selectUser } from "./select/select-user";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

export async function findUserByEmail(ctx: DBContext, config: { email: string }) {
  const query = getUserQuery(ctx);
  withUnseenNotificationCount(query);
  query.leftJoin('unseen_notification_count', 'unseen_notification_count.recipient_id', 'users.id');
  query.join({ subscription: viewnames.subscriptions }, 'subscription.user_id', 'users.id');

  selectUser(query);
  selectUnseenNotificationCount(query);
  query.select(
    db.raw(`
      JSON_BUILD_OBJECT(
      'plan_id', subscription.plan_id, 
      'status', subscription.status,
      'storage_quota', subscription.storage_quota_bytes, 
      'storage_quota_consumed', subscription.storage_quota_consumed,
      'current_period_start', subscription.current_period_start,
      'current_period_end', subscription.current_period_end,
      'override_started_at', subscription.override_started_at,
      'override_expires_at', subscription.override_expires_at,
      'unique_listeners_threshold', subscription.unique_listeners_threshold
      ) AS subscription`),
  );

  return await query.where({ email: config.email }).first() as TUserRestricted;
}