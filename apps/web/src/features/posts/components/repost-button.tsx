import { Repeat } from "lucide-react";
import { useTrackContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useReturnToTrack } from "../hooks/use-return-to-url";

/**Renders repost-buttons using the CountButton-component. Must be placed within a PostProvider.
 * Depends on the AuthProvider, and will be disabled if the current authenticated user is the
 * author of the post.
 */
export function RepostButton() {
  const { track: post, toggleRepost } = useTrackContext();
  const { status, session } = useAuthContext();
  const color = "var(--color-blue-500)";
  const onClick = useReturnToTrack({
    id: post.id,
    action: () => toggleRepost(true),
  });

  const disabled =
    status === "authenticated" &&
    (post?.reposted_by_me || session?.user.audius_user_id === post.canonical_author.id);

  return (
    <CountButton
      color={"inherit"}
      disabled={disabled}
      icon={(props) => (
        <Repeat {...props} color={post?.reposted_by_me ? color : "var(--color-slate-500)"} />
      )}
      value={post?.repost_count}
      onClick={onClick}
    />
  );
}
