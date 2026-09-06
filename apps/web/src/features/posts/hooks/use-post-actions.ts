import { api } from "../../../utils/api/api";
import { cancelable } from "../../../utils/debounced";
import { usePost } from "./use-post";

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
    const initialPlayCount = post.track.stats.play_count;
    const newPlayCount = initialPlayCount + 1;

    api.tracks
      .countPlay(post.track.id)
      .then((res) => {
        if (!res.success) return;
        updatePost({
          track: {
            stats: {
              play_count: newPlayCount,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const toggleLike = async () => {
    const initialIsLiked = post?.track.stats.liked_by_me;
    const initialLikeCount = Number(post?.track.stats.like_count);
    const initialPost = { ...post };
    updatePost({
      track: {
        stats: {
          like_count: initialIsLiked
            ? initialLikeCount - 1
            : initialLikeCount + 1,
          liked_by_me: !initialIsLiked,
        },
      },
    });
    onLikeToggled?.();
    const result = await cancelable.toggleTrackLike(id, initialIsLiked);
    if (result.executed) {
      const res = result.value;
      if (!res.success) {
        updatePost(initialPost);
        onLikeRollback?.();
      }
    }
  };

  const repost = async () => {
    const initialPost = { ...post };
    const initialIsReposted = post?.track.stats.reposted_by_me;
    const initialCount = Number(post?.track.stats.repost_count);
    if (initialIsReposted) {
      return;
    }
    updatePost({
      track: {
        stats: {
          reposted_by_me: !initialIsReposted,
          repost_count: initialIsReposted ? initialCount - 1 : initialCount + 1,
        },
      },
    });
    onRepost?.();
    const result = await cancelable.repost(id, initialIsReposted);
    if (result.executed) {
      if (!result.value.success) {
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
