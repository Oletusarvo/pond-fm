import { TPost } from '../../../types/post';
import { cancelable } from '../../../utils/debounced';

type UsePostActionsProps = {
  post: TPost;
  onChange: (newState: TPost) => void;
  onLikeToggled?: () => void;
  onLikeRollback?: () => void;
  onRepost?: () => void;
  onRepostRollback?: () => void;
};

export function usePostActions({
  post,
  onChange,
  onLikeToggled,
  onLikeRollback,
  onRepost,
  onRepostRollback,
}: UsePostActionsProps) {
  const toggleLike = async () => {
    const initialIsLiked = post.liked_by_me;
    const initialLikeCount = Number(post.like_count);
    const initialPost = { ...post };
    onChange({
      ...post,
      track: {
        ...post.track,
      },
      like_count: initialIsLiked ? initialLikeCount - 1 : initialLikeCount + 1,
      liked_by_me: !initialIsLiked,
    });
    onLikeToggled?.();
    const result = await cancelable.toggleTrackLike(post.track.id, initialIsLiked);
    if (result.executed) {
      const res = result.value;
      if (!res.ok) {
        onChange(initialPost);
        onLikeRollback?.();
      }
    }
  };

  const repost = async () => {
    const initialPost = { ...post };
    const initialIsReposted = post.reposted_by_me;
    const initialCount = Number(post.repost_count);
    if (initialIsReposted) {
      return;
    }
    onChange({
      ...post,
      track: {
        ...post.track,
      },
      reposted_by_me: !initialIsReposted,
      repost_count: initialIsReposted ? initialCount - 1 : initialCount + 1,
    });
    onRepost?.();
    const result = await cancelable.repost(post.track.id, initialIsReposted);
    if (result.executed && result.value !== null && !result.value.ok) {
      onChange(initialPost);
      onRepostRollback?.();
    }
  };

  return {
    toggleLike,
    repost,
  };
}
