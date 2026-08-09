import { useQueryClient } from '@tanstack/react-query';
import { TPost } from '../../../types/post';
import { apiService } from '../../../utils/api-service';
import { cancelable } from '../../../utils/debounced';
import { usePostStore } from './use-post';

type UsePostActionsProps = {
  id: string;
  onLikeToggled?: () => void;
  onLikeRollback?: () => void;
  onRepost?: () => void;
  onRepostRollback?: () => void;
};

export function usePostActions({
  id,
  onLikeToggled,
  onLikeRollback,
  onRepost,
  onRepostRollback,
}: UsePostActionsProps) {
  const postStore = usePostStore();
  const post = postStore.getPost(id);
  const countPlay = async () => {
    const initialPlayCount = post.play_count;
    const newPlayCount = initialPlayCount + 1;

    apiService
      .countPlay(post.track.id)
      .then(res => {
        if (!res.ok) return;
        postStore.updatePost(post.id, {
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
    postStore.updatePost(post.id, {
      ...post,
      track: {
        ...post?.track,
      },
      like_count: initialIsLiked ? initialLikeCount - 1 : initialLikeCount + 1,
      liked_by_me: !initialIsLiked,
    });
    onLikeToggled?.();
    const result = await cancelable.toggleTrackLike(post?.track.id, initialIsLiked);
    if (result.executed) {
      const res = result.value;
      if (!res.ok) {
        postStore.updatePost(post.id, initialPost);
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
    postStore.updatePost(post.id, {
      ...post,
      track: {
        ...post?.track,
      },
      reposted_by_me: !initialIsReposted,
      repost_count: initialIsReposted ? initialCount - 1 : initialCount + 1,
    });
    onRepost?.();
    const result = await cancelable.repost(post?.track.id, initialIsReposted);
    if (result.executed) {
      if (!result.value.ok) {
        postStore.updatePost(post.id, initialPost);
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
