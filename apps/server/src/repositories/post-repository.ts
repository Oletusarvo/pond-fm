import { getUndiscoveredPosts } from '../DAL/posts/get-undiscovered-posts';
import { getNewPosts } from '../DAL/posts/get-new-posts';
import { createCanonicalPost } from '../DAL/posts/create-canonical-post';
import { createPost } from '../DAL/posts/create-post';
import { deletePostById } from '../DAL/posts/delete-post-by-id';
import { createTrackLike } from '../DAL/posts/create-track-like';
import { deleteTrackLike } from '../DAL/posts/delete-track-like';
import { findTrackById } from '../DAL/posts/find-track-by-id';
import { updateTrackMoods } from '../DAL/posts/update-track-moods';
import { updateTrack } from '../DAL/posts/update-track';

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