import { useState } from 'react';
import { setupContext } from '../../../utils/setup-context';
import type { TPost } from '../../../types/post';
import { usePostActions } from '../hooks/use-post-actions';

const [PostContext, usePostContext] = setupContext<{
  post: TPost;
  toggleLike: () => Promise<void>;
  repost: () => void;
}>({ name: 'PostContext' });

type PostProviderProps = React.PropsWithChildren & {
  initialPost: TPost;
};

export function PostProvider({ children, initialPost }: PostProviderProps) {
  const [post, setPost] = useState(initialPost);
  const { toggleLike, repost } = usePostActions({
    post,
    onChange: newState => setPost(newState),
  });

  return (
    <PostContext.Provider value={{ post, toggleLike, repost }}>{children}</PostContext.Provider>
  );
}

export { usePostContext };
