type TNotificationType = "like" | "repost" | "follow";

export type TNotification = {
  sender_id?: string;
  recipient_id: string;
  seen_at: string | null;
} & (
  | {
      type: Extract<TNotificationType, "like" | "repost">;
      track_id: string;
    }
  | {
      type: Exclude<TNotificationType, "like" | "repost">;
    }
);
