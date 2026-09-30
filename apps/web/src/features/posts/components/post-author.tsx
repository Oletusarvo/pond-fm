import { Repeat, Star } from "lucide-react";
import { useTrackContext } from "../providers/post-provider";
import { Link } from "react-router-dom";
import { ObjectEncoder } from "../../../utils/object-encoder";
import { defaults } from "../../../utils/defaults";

/**Renders a post author's username, or the post author followed by the tracks author in case of a repost. */
export function PostAuthor() {
  const { track: post } = useTrackContext();
  const isCanonicalAuthor = post?.is_canonical;
  const canonicalAuthorLink = (
    <Link to={defaults.url.userTracks(post?.canonical_author.id)}>
      {post?.canonical_author.username}
    </Link>
  );
  const posterLink = (
    <Link to={defaults.url.userTracks(post?.author.id)}>{post?.author.username}</Link>
  );

  return (
    <UsernameLabel>
      <div className='flex gap-2 items-baseline'>
        {isCanonicalAuthor ? (
          <>
            {canonicalAuthorLink}
            <Star size='12px' color='transparent' fill={"var(--color-yellow-500)"} />
          </>
        ) : (
          <>
            {posterLink}
            <Repeat size='12px' className='text-primary' />
            {canonicalAuthorLink}
          </>
        )}
      </div>
    </UsernameLabel>
  );
}

function UsernameLabel({ children }: React.PropsWithChildren) {
  return <div className='text-xs text-slate-500 font-semibold'>{children}</div>;
}
