import type { TAuthor } from "./author.js";
import type { TUploadFolder } from "./upload-folder.js";
import type { TUpload } from "./upload.js";

/**The raw shape of tracks returned from the db. */
export type TTrack = {
  id: string;
  /**The id of the upload used as the source of the tracks audio. */
  primary_audio_id: string;
  upload_folder_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  genre: string;
  moods: string[];
  waveform: number[];
  /**The duration of the track in seconds. */
  duration: number;
  /**The size of the track in bytes. */
  size: TUpload['size_bytes'];
  play_count: number;
  unique_listener_count: number;
} & Pick<TUploadFolder, 'author_id'> & Pick<TUpload, 'key'> & ({
  status: Exclude<TUploadFolder['status'], 'deleted'>;
} | {
  status: Extract<TUploadFolder['status'], 'deleted'>
  deleted_at: string;
});


export type TTrackStats = {
  play_count: TTrack['play_count'];
  unique_listener_count: TTrack['unique_listener_count'];
  like_count: number;
  repost_count: number;
  liked_by_me?: boolean;
  reposted_by_me?: boolean;
};

/**The track type displayed to the public. */
export type TTrackPublic = Pick<TTrack, 'id' | 'title' | 'created_at' | 'waveform' | 'duration' | 'genre' | 'moods' | 'size'> & {
  author: TAuthor;
  stats: TTrackStats;
};