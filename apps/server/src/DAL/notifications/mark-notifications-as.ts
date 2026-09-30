import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";

export async function markNotificationAs(
  ctx: DBContext,
  config: {
    user: { audius_user_id: string };
    notification: {
      seen: boolean;
    };
  },
) {
  await ctx(tablenames.notifications)
    .where({ recipient_id: config.user.audius_user_id })
    .update({
      seen_at: config.notification.seen ? new Date() : null,
    });
}
