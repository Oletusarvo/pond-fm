import { getUndiscoveredPosts } from "../DAL/posts/get-undiscovered-posts";
import { getNewPosts } from "../DAL/posts/get-new-posts";
import { createTrackLike } from "../DAL/tracks/create-track-like";
import { deleteTrackLike } from "../DAL/tracks/delete-track-like";
import { findTrackById } from "../DAL/posts/find-track-by-id";

export class PostRepository {
  getUndiscoveredPosts = getUndiscoveredPosts;
  getNewPosts = getNewPosts;
  createTrackLike = createTrackLike;
  deleteTrackLike = deleteTrackLike;
  findTrackById = findTrackById;
}
