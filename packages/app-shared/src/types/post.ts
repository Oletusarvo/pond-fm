import type { TAuthor } from "./author.js";
import type { TTrackPublic } from "./track.js";

export type TPost = {
  id: string;
  author_id: string;
  track_id: string;
  created_at: string;
};

export type TPostPublic = Omit<TPost, 'author_id' | 'track_id'> & {
  /**The author of the post. Can be different from the author of the track. */
  author: TAuthor;
  track: TTrackPublic;
  /**Is the post created by the author of the track? */
  is_canonical: boolean;
}