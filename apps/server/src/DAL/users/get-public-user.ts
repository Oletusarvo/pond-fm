import { TSession, TUserPublic } from "@pondfm/app-shared";
import { tablenames, viewnames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { getUserQuery } from "./get-user-query";
import { selectFollowedByMe } from "./select/select-followed-by-me";
import { selectUser } from "./select/select-user";
import { db } from "../../db-config";

/**Returns the public information of a user. */
export async function getPublicUser(ctx: DBContext, config: { id: string; session?: TSession }) {
  const query = getUserQuery(ctx);
  query.join({ subscription: viewnames.subscriptions }, "subscription.user_id", "users.id");
  selectUser(query);
  selectFollowedByMe(query, config.session);
  query.select("users.following_count");
  query.select("users.follower_count");
  query.select("subscription.plan_id as subcription");
  query.select(
    db.raw(
      "(SELECT COUNT(*) FROM ?? tracks WHERE tracks.author_id = users.id AND tracks.status = active) AS track_count",
      [tablenames.tracks],
    ),
  );
  return (await query.where({ "users.id": config.id }).first()) as TUserPublic;
}
