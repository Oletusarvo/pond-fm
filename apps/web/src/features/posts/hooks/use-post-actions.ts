import { useQueryClient } from '@tanstack/react-query';
import { TPost } from '../../../types/post';
import { apiService } from '../../../utils/api/api-service';
import { cancelable } from '../../../utils/debounced';
import { usePost, usePostStore } from './use-post';

type UsePostActionsProps = {
  trackId: string;
  onLikeToggled?: () => void;
  onLikeRollback?: () => void;
  onRepost?: () => void;
  onRepostRollback?: () => void;
};

export function usePostActions({
  trackId: id,
  onLikeToggled,
  onLikeRollback,
  onRepost,
  onRepostRollback,
}: UsePostActionsProps) {
  const { post, updatePost } = usePost(id);
  const countPlay = async () => {
    const initialPlayCount = post.play_count;
    const newPlayCount = initialPlayCount + 1;

    apiService
      .countPlay(post.track.id)
      .then(res => {
        if (!res.ok) return;
        updatePost({
          play_count: newPlayCount,
        });

      })
      .catch(err => {
        console.log(err.message);
      });
  }

  const toggleLike = async () => {
    const initialIsLiked = post?.liked_by_me;
    const initialLikeCount = Number(post?.like_count);
    const initialPost = { ...post };
    updatePost({
      like_count: initialIsLiked ? initialLikeCount - 1 : initialLikeCount + 1,
      liked_by_me: !initialIsLiked,
    });
    onLikeToggled?.();
    const result = await cancelable.toggleTrackLike(id, initialIsLiked);
    if (result.executed) {
      const res = result.value;
      if (!res.ok) {
        updatePost(initialPost);
        onLikeRollback?.();
      }

    }
  };

  const repost = async () => {
    const initialPost = { ...post };
    const initialIsReposted = post?.reposted_by_me;
    const initialCount = Number(post?.repost_count);
    if (initialIsReposted) {
      return;
    }
    updatePost({
      reposted_by_me: !initialIsReposted,
      repost_count: initialIsReposted ? initialCount - 1 : initialCount + 1,
    });
    onRepost?.();
    const result = await cancelable.repost(id, initialIsReposted);
    if (result.executed) {
      if (!result.value.ok) {
        updatePost(initialPost);
        onRepostRollback?.();
      }
    }
  };

  return {
    countPlay,
    toggleLike,
    repost,
  };
}
