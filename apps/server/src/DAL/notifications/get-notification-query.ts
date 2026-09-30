import { db } from "../../db-config";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { withAuthor } from "../posts/with/with-author";
import { selectNotification } from "./select/select-notification";
import { selectRecipient } from "./select/select-recipient";
import { selectSender } from "./select/select-sender";
import { selectTrack } from "./select/select-track";

export function getNotificationQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  withAuthor(query);
  query
    .leftJoin("track", "track.audius_track_id", "notifications.track_id")
    .join({ recipient: "author_json" }, "recipient.audius_user_id", "notifications.recipient_id")
    .join({ sender: "author_json" }, "sender.audius_user_id", "notifications.sender_id");

  query.with("track", (qb) => {
    qb.select(
      "audius_track_id",
      db.raw("JSON_BUILD_OBJECT('audius_track_id', audius_track_id) AS json"),
    ).from(tablenames.tracks);
  });
  selectNotification(query);
  selectRecipient(query);
  selectSender(query);
  selectTrack(query);
  query.orderBy("notifications.created_at", "desc");
  return query;
}
