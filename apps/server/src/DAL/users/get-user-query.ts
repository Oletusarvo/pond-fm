import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { fromUsers } from "./from/from-users";
import { selectUnseenNotificationCount } from "./select/select-notification-count";
import { selectUser } from "./select/select-user";
import { withUnseenNotificationCount } from "./with/with-unseen-notification-count";

export function getUserQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  fromUsers(query);
  return query;
}