export type TNotification = {
  id?: string;
  recipient_id: string;
  sender_id: string;
  track_id?: string;
  type: 'like' | 'repost' | 'follow';
};
