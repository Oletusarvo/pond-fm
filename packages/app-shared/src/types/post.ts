import type { TAuthor } from "./author.js";
import type { TTrackPublic } from "./track.js";

export type TPost = {
  id: string;
  liked_by_me: boolean;
  reposted_by_me: boolean;
  is_canonical: boolean;
  like_count: number;
  repost_count: number;
  play_count: number;
  created_at: string;
  author: TAuthor;
  track: TTrackPublic;
};