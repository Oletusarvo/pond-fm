import { Repeat, Star } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Link } from 'react-router-dom';
import { ObjectEncoder } from '../../../utils/object-encoder';

/**Renders a post author's username, or the post author followed by the tracks author in case of a repost. */
export function PostAuthor() {
  const { post } = usePostContext();
  const isCanonicalAuthor = post.is_canonical;
  const canonicalAuthorLink = (
    <Link to={`/user/${ObjectEncoder.encodeToBase64Url(post.track.author)}`}>
      {post.track.author.username}
    </Link>
  );
  const posterLink = (
    <Link to={`/user/${ObjectEncoder.encodeToBase64Url(post.author)}`}>{post.author.username}</Link>
  );
  return (
    <UsernameLabel>
      <div className='flex gap-2 items-baseline'>
        {isCanonicalAuthor ? (
          <>
            {canonicalAuthorLink}
            <Star
              size='12px'
              color='transparent'
              fill={'var(--color-yellow-500)'}
            />
          </>
        ) : (
          <>
            {posterLink}
            <Repeat
              size='12px'
              className='text-primary'
            />
            {canonicalAuthorLink}
          </>
        )}
      </div>
    </UsernameLabel>
  );
}

function UsernameLabel({ children }: React.PropsWithChildren) {
  return <div className='text-sm text-slate-500 font-semibold'>{children}</div>;
}
