import { Heart, Repeat } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { Spinner } from '../../../components/spinner';
import { useNotificationsContext } from '../providers/notifications-provider';
import React, { useEffect } from 'react';
import { Separator } from '../../../components/separator';
import { formatDistanceToNow } from 'date-fns';
import { apiService } from '../../../utils/api-service';

export function NotificationsModal() {
  const { toggleShowNotificationsModal, nextPageTriggerRef, isPending, notifications } =
    useNotificationsContext();

  useEffect(() => {
    apiService.markNotificationsAsSeen(notifications.filter(n => n.seen_at == null)).catch(err => {
      console.log('Failed to mark notifications as seen!', err.message);
    });
  }, [notifications]);

  return (
    <Modal
      title='Notifications'
      onClose={() => toggleShowNotificationsModal(false)}>
      <div className='flex flex-col w-full'>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {notifications?.length > 0 ? (
              notifications.map(n => {
                return (
                  <React.Fragment key={n.id}>
                    <Notification notification={n} />
                    <Separator />
                  </React.Fragment>
                );
              })
            ) : (
              <span>No notifications yet.</span>
            )}
          </>
        )}
      </div>
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
