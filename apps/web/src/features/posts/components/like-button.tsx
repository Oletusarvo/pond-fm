import { Heart } from "lucide-react";
import { usePostContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostActions } from "../hooks/use-post-actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useReturnToTrack } from "../hooks/use-return-to-url";

/**Renders a CountButton with a Heart-icon. */
export function LikeButton() {
  const { post } = usePostContext();
  const location = useLocation();
  const postActions = usePostActions({ trackId: post.track.id });
  const color = "var(--color-red-500)";
  const onClick = useReturnToTrack({
    id: post.track.id,
    action: postActions.toggleLike,
  });

  return (
    <CountButton
      color={"inherit"}
      icon={(props) => (
        <Heart
          {...props}
          color={post?.track.stats.liked_by_me ? "transparent" : color}
          fill={post?.track.stats.liked_by_me ? color : "transparent"}
        />
      )}
      value={post?.track.stats.like_count}
      onClick={onClick}
    />
  );
}
