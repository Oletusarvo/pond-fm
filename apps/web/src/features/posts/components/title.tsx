import { Link, useNavigate } from "react-router-dom";
import { useTrackContext } from "../providers/post-provider";

export function Title() {
  const { track: track } = useTrackContext();
  return (
    <Link to={`/track/${track.id}`} onClick={(e) => e.stopPropagation()}>
      <h2 className='font-semibold text-sm'>{track?.title}</h2>
    </Link>
  );
}
