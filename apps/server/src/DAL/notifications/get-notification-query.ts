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
  query
    .leftJoin('track', 'track.id', 'notifications.track_id')
    .join({ recipient: 'author_json' }, 'recipient.id', 'notifications.recipient_id')
    .join({ sender: 'author_json' }, 'sender.id', 'notifications.sender_id');

  withAuthor(query);
  query.with('track', qb => {
    qb.select('id', db.raw("JSON_BUILD_OBJECT('id', id, 'title', title) AS json")).from(
      tablenames.tracks,
    );
  });
  selectNotification(query);
  selectRecipient(query);
  selectSender(query);
  selectTrack(query);
  query.orderBy('notifications.created_at', 'desc');
  return query;
}