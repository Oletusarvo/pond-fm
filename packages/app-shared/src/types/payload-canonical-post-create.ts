import type { TAuthor } from "./author.js"
import type { TTrack } from "./track.js";
import type { TUpload } from "./upload.js";

export type TPayloadPostCanonicalCreate = {
  author: Pick<TAuthor, 'id'>;
  upload: Omit<TUpload, 'id' | 'upload_folder_id' | 'key' | 'filename'>;
  track: Pick<TTrack, 'title'>;
}