export type TTrack = {
  id?: string;
  title: string;
  user_id: string;
  duration: number;
  filename: string;
  waveform: number[];
  genre?: string;
  moods?: string[]
  is_discovered?: boolean;
};

export type TrackAndUserId = {
  track_id: TTrack['id'];
  user_id: TTrack['user_id'];
};
