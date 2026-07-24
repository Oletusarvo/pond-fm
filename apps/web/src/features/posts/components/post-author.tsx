import { Repeat, Star } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';

/**Renders a post author's username, or the post author followed by the tracks author in case of a repost. */
export function PostAuthor() {
  const { post } = usePostContext();
  const isCanonicalAuthor = post.is_canonical;

  return (
    <UsernameLabel>
      <div className='flex gap-2 items-baseline'>
        {isCanonicalAuthor ? (
          <>
            <span>{post.author.username}</span>
            <Star
              size='12px'
              color='transparent'
              fill={'var(--color-yellow-500)'}
            />
          </>
        ) : (
          <>
            <span>{post.author.username}</span>
            <Repeat
              size='12px'
              className='text-primary'
            />
            {post.track.author.username}
          </>
        )}
      </div>
    </UsernameLabel>
  );
}

function UsernameLabel({ children }: React.PropsWithChildren) {
  return <div className='text-sm text-slate-500 font-semibold'>{children}</div>;
}
