import { useState } from 'react';
import { setupContext } from '../../../utils/setup-context';
import type { TPost } from '../../../types/post';
import { Modal } from '../../../components/modal';
import { Repeat } from 'lucide-react';
import { Button } from '../../../components/button';
import { useEventHandler } from '../../../hooks/use-event-handler';
import { useActionContext } from '../../../providers/action-provider';
import { TrackModal } from '../components/track-modal';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { usePost } from '../hooks/use-post';
import { RepostModal } from '../components/repost-modal';

const [PostContext, usePostContext] = setupContext<{
  post: TPost;
  toggleRepost: (state: boolean) => void;
  toggleEdit: (state: boolean) => void;
}>({ name: 'PostContext' });

type PostProviderProps = React.PropsWithChildren & {
  id: string;
};

export function PostProvider({ children, id }: PostProviderProps) {
  const { post, updatePost } = usePost(id);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const authService = useAuthContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const actionService = useActionContext();

  const toggleRepost = (state: boolean) => {
    setShowRepostModal(state);
  };

  const toggleEdit = (state: boolean) => setShowEditModal(state);


  useEventHandler({
    type: 'track-played',
    service: actionService,
    handler: (e: CustomEvent) => {
      if (e.detail.id === post?.track.id) {
        updatePost({
          ...post,
          play_count: Number(post?.play_count + 1),
        });
      }
    },
  });

  if (!post) {
    return null;
  }

  return (
    <PostContext.Provider value={{ post, toggleRepost, toggleEdit }}>
      {children}
      {showRepostModal ? (
        <RepostModal />
      ) : null}
      {
        authService.status === 'authenticated' ? (showEditModal ? <TrackModal track={post?.track} onClose={() => toggleEdit(false)} /> : null) : null
      }
    </PostContext.Provider>
  );
}

export { usePostContext };
