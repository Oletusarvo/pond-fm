import { db } from "../../../../db-config";
import { getNotificationsByUserId } from "../../../../DAL/notifications/get-notifications-by-user-id";

import { getCursor } from "../../../../utils/get-cursor";
import { createHandler } from "@pondfm/server-utils";
import { TAuthenticatedRequest } from "../../../../types/request";
import { audius } from "../../../../audius.config";

export const getNotificationsHandler = createHandler(async (req: TAuthenticatedRequest, res) => {
  const cursor = getCursor(req);
  const session = req.session;
  const result = await getNotificationsByUserId(db, {
    user: { id: session.user.id },
    cursor,
  });
  if (result.items.length == 0)
    return res.status(204).json({
      cursor: null,
      items: [],
    });
  const userIdSet = new Set<string>(
    result.items.map((n) => [n.recipient.id, n.sender.id]).flatMap((n) => n),
  );
  const userData = await audius.users.get(Array.from(userIdSet));
  const userMap = new Map<any, any>(userData.map((u) => [u.id, u]));
  const trackIds = new Set<string>(result.items.map((n) => n.track.id));
  const trackData = await audius.tracks.get(Array.from(trackIds));

  const trackMap = new Map(trackData.map((track) => [track.id, track]));

  const recipientData = userMap.get(session.user.id);

  const notifications = result.items.map((item) => {
    const track = trackMap.get(item.track.id);
    const senderData = userMap.get(item.sender.id);
    return {
      ...item,
      track: {
        title: track.title,
      },
      sender: {
        id: senderData.id,
        username: senderData.name,
      },
      recipient: {
        id: recipientData.id,
        username: recipientData.name,
      },
    };
  });

  return res.json({
    cursor: result.cursor,
    items: notifications,
  });
});
