import { Heart, Repeat } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { Spinner } from '../../../components/spinner';
import { useNotificationsContext } from '../providers/notifications-provider';
import React from 'react';
import { Separator } from '../../../components/separator';

export function NotificationsModal() {
  const { toggleShowNotificationsModal, nextPageTriggerRef, isPending, notifications } =
    useNotificationsContext();
  return (
    <Modal
      fullScreen
      title='Notifications'
      onClose={() => toggleShowNotificationsModal(false)}>
      <div className='flex flex-col w-full'>
        {isPending ? (
          <Spinner />
        ) : (
          <>
            {notifications?.map(n => {
              const icon =
                n.type === 'like' ? (
                  <Heart
                    size='1rem'
                    fill='var(--color-red-500)'
                    color='transparent'
                  />
                ) : (
                  <Repeat
                    size='1rem'
                    color='var(--color-blue-500)'
                  />
                );
              const message =
                n.type === 'like' ? (
                  <>
                    <span className='font-semibold'>{n.sender.username}</span> liked your track{' '}
                    <span className='font-semibold'>{n.track.title}</span>
                  </>
                ) : (
                  <>
                    <span className='font-semibold'>{n.sender.username}</span> reposted your track{' '}
                    <span className='font-semibold'>{n.track.title}</span>
                  </>
                );
              return (
                <React.Fragment key={n.id}>
                  <div className='flex items-center gap-4 w-full text-black text-sm'>
                    {icon}
                    {message}
                  </div>
                  <Separator />
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    </Modal>
  );
}
