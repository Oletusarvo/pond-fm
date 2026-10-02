import { api } from "../../../utils/api/api";
import { cancelable } from "../../../utils/debounced";
import { useTrack, useTrackStore } from "./use-post";

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
  //const postStore = usePostStore();
  const { track: post, updateTrack: updatePost } = useTrack(id);
  //const postStore = usePostStore();
  const countPlay = async () => {
    const initialPlayCount = post.play_count;
    const newPlayCount = Number(initialPlayCount) + 1;

    await api.tracks
      .countPlay(post.id)
      .then((res) => {
        if (!res.success) return;
        updatePost({
          play_count: newPlayCount,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const toggleLike = async () => {
    const initialIsLiked = post?.liked_by_me;
    const initialLikeCount = Number(post?.like_count);
    const initialPost = { ...post };
    updatePost({
      moods: post.moods,
      like_count: initialIsLiked ? initialLikeCount - 1 : initialLikeCount + 1,
      liked_by_me: !initialIsLiked,
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
