import { Heart } from "lucide-react";
import { useTrackContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useReturnToTrack } from "../hooks/use-return-to-url";
import { useTrackActionContext } from "../providers/track-action-provider";
import { usePostActions } from "../hooks/use-post-actions";

/**Renders a CountButton with a Heart-icon. */
export function LikeButton() {
  const { track: post } = useTrackContext();
  const color = "var(--color-red-500)";
  const { toggleLike } = usePostActions({ trackId: post.id });
  const onClick = useReturnToTrack({
    id: post.id,
    action: () => {
      toggleLike();
    },
  });

  return (
    <CountButton
      color={"inherit"}
      icon={(props) => (
        <Heart
          {...props}
          color={post?.liked_by_me ? "transparent" : color}
          fill={post?.liked_by_me ? color : "transparent"}
        />
      )}
      value={post?.like_count}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    />
  );
}
