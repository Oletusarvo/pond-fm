import { Heart } from "lucide-react";
import { usePostContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePostActions } from "../hooks/use-post-actions";

/**Renders a CountButton with a Heart-icon. */
export function LikeButton() {
  const { post } = usePostContext();
  const postActions = usePostActions({ trackId: post.track.id });
  const { status } = useAuthContext();
  const color = "var(--color-red-500)";
  return (
    <CountButton
      color={"inherit"}
      disabled={status !== "authenticated"}
      icon={(props) => (
        <Heart
          {...props}
          color={post?.track.stats.liked_by_me ? "transparent" : color}
          fill={post?.track.stats.liked_by_me ? color : "transparent"}
        />
      )}
      value={post?.track.stats.like_count}
      onClick={() => postActions.toggleLike()}
    />
  );
}
