import { getUndiscoveredPosts } from '../query/posts/get-undiscovered-posts';
import { getNewPosts } from '../query/posts/get-new-posts';
import { createCanonicalPost } from '../query/posts/create-canonical-post';
import { createPost } from '../query/posts/create-post';
import { deletePostById } from '../query/posts/delete-post-by-id';
import { createTrackLike } from '../query/posts/create-track-like';
import { deleteTrackLike } from '../query/posts/delete-track-like';
import { findTrackById } from '../query/posts/find-track-by-id';
import { updateTrackMoods } from '../query/posts/update-track-moods';
import { updateTrack } from '../query/posts/update-track';

export class PostRepository {
  getUndiscoveredPosts = getUndiscoveredPosts
  getNewPosts = getNewPosts
  createCanonicalTrack = createCanonicalPost
  createPost = createPost
  deletePostById = deletePostById
  createTrackLike = createTrackLike
  deleteTrackLike = deleteTrackLike
  findTrackById = findTrackById
  updateTrack = updateTrack
}