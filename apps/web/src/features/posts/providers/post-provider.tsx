import { useState } from 'react';
import { setupContext } from '../../../utils/setup-context';
import type { TPost } from '../../../types/post';
import { usePostActions } from '../hooks/use-post-actions';
import { Modal } from '../../../components/modal';
import { Repeat } from 'lucide-react';
import { Button } from '../../../components/button';
import { useEventHandler } from '../../../hooks/use-event-handler';
import { useEventsContext } from '../../../providers/events-provider';
import { apiService } from '../../../utils/api-service';
import { TrackModal } from '../components/track-modal';
import { useAuthContext } from '../../auth/providers/auth-provider';

const [PostContext, usePostContext] = setupContext<{
  post: TPost;
  toggleLike: () => Promise<void>;
  toggleRepost: (state: boolean) => void;
  toggleEdit: (state: boolean) => void;
}>({ name: 'PostContext' });

type PostProviderProps = React.PropsWithChildren & {
  initialPost: TPost;
};

export function PostProvider({ children, initialPost }: PostProviderProps) {
  const [post, setPost] = useState(initialPost);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const authService = useAuthContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const eventsService = useEventsContext();
  const { toggleLike, repost } = usePostActions({
    post,
    onChange: newState => setPost(newState),
  });

  const toggleRepost = (state: boolean) => {
    setShowRepostModal(state);
  };

  const toggleEdit = (state: boolean) => setShowEditModal(state);

  useEventHandler({
    type: 'track-played',
    service: eventsService,
    handler: (e: CustomEvent) => {
      if (e.detail.id === post.track.id) {
        setPost({
          ...post,
          play_count: post.play_count + 1,
        });
      }
    },
  });

  return (
    <PostContext.Provider value={{ post, toggleLike, toggleRepost, toggleEdit }}>
      {children}

      {showRepostModal ? (
        <Modal
          title='Repost Track'
          onClose={() => toggleRepost(false)}>
          <div className='flex flex-col w-full gap-4 items-center'>
            <Repeat
              color='var(--color-primary)'
              size='3rem'
            />
            <span>
              You are about to repost <strong>{post.track.title}</strong> by{' '}
              <strong>{post.track.author.username}</strong>. Reposts cannot currently be undone. Are
              you sure?
            </span>

            <div className='flex gap-4 w-full'>
              <Button
                shape='rounded'
                paddingEnabled
                onClick={() => toggleRepost(false)}
                variant='outlined'
                fullWidth>
                Cancel
              </Button>
              <Button
                shape='rounded'
                paddingEnabled
                onClick={() => {
                  repost();
                  toggleRepost(false);
                }}
                variant='contained'
                fullWidth>
                <Repeat size='1rem' />
                Repost
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
      {
        authService.status === 'authenticated' ? (showEditModal ? <TrackModal track={post.track} onClose={() => toggleEdit(false)} /> : null) : null
      }
    </PostContext.Provider>
  );
}

export { usePostContext };
