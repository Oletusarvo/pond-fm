import { Link, useNavigate } from "react-router-dom";
import { useTrackContext } from "../providers/post-provider";

export function Title() {
  const { track: track } = useTrackContext();
  return (
    <Link
      to={`/track/${track.id}`}
      onClick={(e) => e.stopPropagation()}
      className='group block min-w-0'
    >
      <h2 className='overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-slate-900 transition-colors group-hover:text-emerald-700 md:text-lg'>
        {track?.title}
      </h2>
    </Link>
  );
}
