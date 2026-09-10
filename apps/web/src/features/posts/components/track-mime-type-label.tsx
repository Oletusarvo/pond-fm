import { useClassName } from "../../../hooks/use-class-name";
import { usePostContext } from "../providers/post-provider";

/**
 * Renders a label indicating the quality of a track's audio.
 * @returns HQ when the track's audio is a wav-file, null otherwise.
 * @todo
 * */
export function TrackQualityLabel() {
  const { post } = usePostContext();
  const track = post.track;
  const className = useClassName(
    "rounded-sm border py-px px-1 bg-amber-500/10 border-amber-500/20 text-yellow-500 text-xs font-semibold",
  );

  return <div className={className}>HQ</div>;
}
