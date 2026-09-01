import type { TAuthor } from "./author.js";
import type { TUploadFolder } from "./upload-folder.js";
import type { TUpload } from "./upload.js";

export type TTrack = {
  id: string;
  /**The id of the upload used as the source of the tracks audio. */
  primary_audio_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  genre: string;
  moods: string[];
  waveform: number[];
  /**The duration of the track in seconds. */
  duration: number;
  /**The size of the track in bytes. */
  size: TUpload['size'];
} & Pick<TUploadFolder, 'author_id'> & ({
  status: Exclude<TUploadFolder['status'], 'deleted'>;
} | {
  status: Extract<TUploadFolder['status'], 'deleted'>
  deleted_at: string;
});

/**The track type displayed to the public. */
export type TTrackPublic = Pick<TTrack, 'id' | 'title' | 'created_at' | 'waveform' | 'duration' | 'genre' | 'moods' | 'size'> & {
  author: TAuthor;
};