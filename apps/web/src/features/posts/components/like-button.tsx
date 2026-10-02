import { Heart } from "lucide-react";
import { useTrackContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostActions } from "../hooks/use-post-actions";
import { useLocation, useNavigate } from "react-router-dom";
import { useReturnToTrack } from "../hooks/use-return-to-url";

/**Renders a CountButton with a Heart-icon. */
export function LikeButton() {
  const { track: post } = useTrackContext();
  const location = useLocation();
  const postActions = usePostActions({ trackId: post.id });
  const color = "var(--color-red-500)";
  const onClick = useReturnToTrack({
    id: post.id,
    action: postActions.toggleLike,
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
