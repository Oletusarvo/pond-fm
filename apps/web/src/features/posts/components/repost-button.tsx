import { Repeat } from "lucide-react";
import { usePostContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useReturnToTrack } from "../hooks/use-return-to-url";

/**Renders repost-buttons using the CountButton-component. Must be placed within a PostProvider.
 * Depends on the AuthProvider, and will be disabled if the current authenticated user is the
 * author of the post.
 */
export function RepostButton() {
  const { post, toggleRepost } = usePostContext();
  const { status, session } = useAuthContext();
  const color = "var(--color-blue-500)";
  const stats = post?.track.stats;
  const onClick = useReturnToTrack({
    id: post.track.id,
    action: () => toggleRepost(true),
  });

  const disabled =
    status === "authenticated" &&
    (stats?.reposted_by_me || session?.user.id === post.track.author.id);

  return (
    <CountButton
      color={"inherit"}
      disabled={disabled}
      icon={(props) => (
        <Repeat {...props} color={stats?.reposted_by_me ? color : "var(--color-slate-500)"} />
      )}
      value={stats?.repost_count}
      onClick={onClick}
    />
  );
}
