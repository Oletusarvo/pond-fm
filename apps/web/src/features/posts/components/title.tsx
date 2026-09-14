import { Link, useNavigate } from "react-router-dom";
import { usePostContext } from "../providers/post-provider";

export function Title() {
  const { post } = usePostContext();
  return (
    <Link to={`/track/${post.track.id}`}>
      <h2 className='font-semibold text-sm'>{post?.track.title}</h2>
    </Link>
  );
}
