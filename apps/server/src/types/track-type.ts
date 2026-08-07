export type TTrack = {
  id?: string;
  title: string;
  author_id: string;
  genre?: string;
  moods?: string[];
};

export type TrackAndUserId = {
  track_id: TTrack['id'];
  user_id: TTrack['author_id'];
};
