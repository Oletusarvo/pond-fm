import { Play, Settings } from "lucide-react";
import { useTrackContext } from "../providers/post-provider";
import { CountButton } from "./count-button";
import { LikeButton } from "./like-button";
import { RepostButton } from "./repost-button";
import { TipButton } from "./tip-button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { Button } from "../../../components/button";

/**Renders a posts play count, like count and repost count using the CountButton-, LikeButton-, and RepostButton components.
 * Must be placed within a PostProvider. Depends on the AuthProvider, and will skip rendering of the repost button if the current
 * authenticated user is the author of the post track.
 */
export function StatsArea() {
  const { track: post } = useTrackContext();
  return (
    <div className='flex xs:gap-2 md:gap-5 items-center'>
      <CountButton disabled={true} color='inherit' icon={Play} value={post?.play_count} />

      <LikeButton />
      <RepostButton />
    </div>
  );
}
