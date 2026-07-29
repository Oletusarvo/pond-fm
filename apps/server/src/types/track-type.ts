export type TTrack = {
  id?: string;
  title: string;
  user_id: string;
  tags: string[];
  duration: number;
  filename: string;
  waveform: number[];
};

export type TrackAndUserId = {
  track_id: TTrack['id'];
  user_id: TTrack['user_id'];
};
