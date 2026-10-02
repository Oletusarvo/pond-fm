import { tablenames } from "../../tablenames";
import { TCursor } from "../../types/cursor";
import { DBContext } from "../../types/db-context";
import { applyCursor } from "../posts/utils/apply-cursor";
import { resolveQueryWithCursor } from "../posts/utils/resolve-query-with-cursor";
import { getNotificationQuery } from "./get-notification-query";
import { selectNotification } from "./select/select-notification";

export async function getNotificationsByUserId(
  ctx: DBContext,
  config: { user: { id: string }; cursor?: TCursor },
) {
  console.log("user id while fetching notes", config.user.id);
  const query = getNotificationQuery(ctx);
  query.from({ notifications: tablenames.notifications });
  query.where({ "notifications.recipient_id": config.user.id });
  query.orderBy("notifications.created_at", "desc");

  applyCursor(query, {
    dir: "desc",
    timestampColumn: "notifications.created_at",
    idColumn: "notifications.id",
    cursor: config.cursor,
  });

  return await resolveQueryWithCursor(query, { pageSize: 10 });
}
