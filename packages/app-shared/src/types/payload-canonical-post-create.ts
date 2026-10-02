import type { TAuthor } from "./author.js";
import type { TTrack } from "./track.js";
import type { TUpload } from "./upload.js";

export type TPayloadPostCanonicalCreate = {
  author: Pick<TAuthor, "id">;
  track: Pick<TTrack, "title">;
};
