import { Heart, Repeat, UserPlus } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { NotificationsProvider, useNotificationsContext } from '../providers/notifications-provider';
import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { apiService } from '../../../utils/api-service';
import { Feed } from '../../../components/feed';
import { FeedProvider, useFeedContext } from '../../../providers/feed-provider';
import React from 'react';
import { Separator } from '../../../components/separator';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { FeedModal } from '../../../components/feed-modal';
import { Link, useNavigate } from 'react-router-dom';

export function NotificationsModal() {
  const { toggleShowNotificationsModal, hasUnseen, updateHasUnseen } = useNotificationsContext();
  const authService = useAuthContext();
  if (hasUnseen) {
    updateHasUnseen(false);
  }

  useEffect(() => {
    if (hasUnseen) {
      apiService
        .markNotificationsAsSeen()
        .catch(err => {
          console.log('Failed to mark notifications as seen!', err.message);
        });
    }
  }, [updateHasUnseen]);

  return (
    <FeedModal
      queryFn={cursor => apiService.getNotifications(cursor)}
      queryKey={['notifications', authService.session?.user.id]}
      title='Notifications'
      onClose={() => toggleShowNotificationsModal(false)}>
      <Feed
        renderComponent={({ item }) => <Notification notification={item} />}
        keyExtractor={item => item.id}
      />
    </FeedModal>
  );
}

function Notification({ notification }) {
  const navigate = useNavigate();
  const notificationsService = useNotificationsContext();
  const timestamp = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const { type } = notification;
  const Icon = type === 'like' ? Heart : type === 'repost' ? Repeat : UserPlus;
  const iconColor = type === 'like' ? 'var(--color-red-500)' : type === 'repost' ? 'var(--color-blue-500)' : 'var(--color-primary)';
  const iconProps =
    type === 'like' ? { color: 'transparent', fill: iconColor } : { color: iconColor };
  const message = type === 'like' ? 'liked your track' : type === 'repost' ? 'reposted your track' : 'followed you';
  return (
    <div className='flex w-full items-center text-black gap-2 py-4' onClick={() => {
      notificationsService.toggleShowNotificationsModal(false);
      navigate(`/user/${notification.sender.id}`);
    }}>
      <Icon
        {...iconProps}
        size='1.2rem'
      />
      <div className='flex flex-col flex-1 items-start'>
        <div className='flex items-center gap-2 text-sm'>
          <strong>{notification.sender.username}</strong>
          <span>{message}</span>
          {
            notification.type !== 'follow' ? (
              <strong>{notification.track?.title}</strong>
            ) : null
          }

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
