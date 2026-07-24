import { useState } from 'react';
import { TAuthor } from '../../../types/author';
import { setupContext } from '../../../utils/setup-context';
import { apiService } from '../../../utils/api-service';
import { Modal } from '../../../components/modal';
import { Button } from '../../../components/button';
import { TTrack } from '../../../types/track';
import { Repeat } from 'lucide-react';
import { usePostContext } from './post-provider';

const [RepostContext, useRepostContext] = setupContext<{
  repost: () => Promise<void>;
  showRepostModal: () => void;
}>({ name: 'TippingContext' });

type RepostProviderProps = React.PropsWithChildren & {
  track: TTrack;
};
/**Provides logic for giving tips for users. */
export function RepostProvider({ children, track }: RepostProviderProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [showModal, setShowModal] = useState(false);

  const showRepostModal = () => {
    setShowModal(true);
  };

  const repost = async () => {
    setStatus('loading');
  };

  const cancel = () => {
    setStatus('idle');
    setShowModal(false);
  };

  return (
    <RepostContext.Provider value={{ repost, showRepostModal }}>
      {children}
      {showModal ? (
        <Modal
          title='Repost Track'
          onClose={cancel}>
          <div className='flex flex-col w-full gap-4 items-center'>
            <Repeat
              color='var(--color-primary)'
              size='3rem'
            />
            <span>
              You are about to repost <strong>{track.title}</strong> by{' '}
              <strong>{track.author.username}</strong>. Reposts cannot currently be undone. Are you
              sure?
            </span>

            <div className='flex gap-4 w-full'>
              <Button
                shape='rounded'
                paddingEnabled
                onClick={cancel}
                variant='outlined'
                fullWidth>
                Cancel
              </Button>
              <Button
                shape='rounded'
                paddingEnabled
                onClick={repost}
                variant='contained'
                fullWidth>
                <Repeat size='1rem' />
                Repost
              </Button>
            </div>
          </div>
        </Modal>
      ) : null}
    </RepostContext.Provider>
  );
}

export { useRepostContext };
