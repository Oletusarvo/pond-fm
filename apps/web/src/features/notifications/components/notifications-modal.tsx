import { Heart, Repeat } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { useNotificationsContext } from '../providers/notifications-provider';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { apiService } from '../../../utils/api-service';
import { Feed } from '../../posts/components/feed';
import { FeedProvider, useFeedContext } from '../../../providers/feed-provider';
import React from 'react';
import { Separator } from '../../../components/separator';
import { useAuthContext } from '../../auth/providers/auth-provider';

// TODO:
// Infinite scrolling for notifications causes the sentinel ref to repeatedly
// mount/unmount when the notifications modal is opened, leading to a
// "Maximum update depth exceeded" error. Other FeedProvider usages are
// unaffected. Temporarily limiting notifications to the first page.
export function NotificationsModal() {
  const { toggleShowNotificationsModal, hasUnseen, updateHasUnseen } = useNotificationsContext();
  const authService = useAuthContext();
  useEffect(() => {
    if (hasUnseen) {
      apiService
        .markNotificationsAsSeen()
        .then(res => {
          if (res.ok) {
            updateHasUnseen(false);
          }
        })
        .catch(err => {
          console.log('Failed to mark notifications as seen!', err.message);
        });
    }
  }, [updateHasUnseen]);

  return (
    <Modal
      title='Notifications'
      onClose={() => toggleShowNotificationsModal(false)}>
      <FeedProvider
        queryFn={cursor => apiService.getNotifications(cursor)}
        queryKey={['notifications', authService.session?.user.id]}>
        <Feed
          renderComponent={({ item }) => <Notification notification={item} />}
          keyExtractor={item => item.id}
        />
      </FeedProvider>
    </Modal>
  );
}

function Notification({ notification }) {
  const timestamp = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const Icon = notification.type === 'like' ? Heart : Repeat;
  const iconColor = notification.type === 'like' ? 'var(--color-red-500)' : 'var(--color-blue-500)';
  const iconProps =
    notification.type === 'like' ? { color: 'transparent', fill: iconColor } : { color: iconColor };
  const message = notification.type === 'like' ? 'liked your track' : 'reposted your track';
  return (
    <div className='flex w-full items-center text-black gap-2 py-4'>
      <Icon
        {...iconProps}
        size='1.2rem'
      />
      <div className='flex flex-col flex-1 items-start'>
        <div className='flex items-center gap-2 text-sm'>
          <strong>{notification.sender.username}</strong>
          <span>{message}</span>
          <strong>{notification.track.title}</strong>
          {notification.seen_at === null ? (
            <div className='rounded-md px-1 border-primary/20 bg-primary/10 text-primary text-xs'>
              New
            </div>
          ) : null}
        </div>
        <span className='text-slate-500 text-sm'>{timestamp}</span>
      </div>
    </div>
  );
}
