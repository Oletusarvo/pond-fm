import { ArrowUpCircle, Bell, Menu } from 'lucide-react';
import { Button } from './button';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/providers/auth-provider';
import {
  NotificationsProvider,
  useNotificationsContext,
} from '../features/notifications/providers/notifications-provider';

export function MainHeader() {
  const navigate = useNavigate();
  const { status } = useAuthContext();
  const location = useLocation();
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm'>
        <h2 className='font-semibold cursive text-lg'>
          🐸<span className='text-lg'>Pond.fm</span>
        </h2>
        |
        <span>
          {location.pathname === '/undiscovered'
            ? 'Undiscovered'
            : location.pathname === '/new'
              ? 'New'
              : ''}
        </span>
      </div>

      <div className='flex gap-4 items-center'>
        {status === 'authenticated' ? (
          <>
            <NotificationsProvider>
              <NotificationsButton />
            </NotificationsProvider>

            <Button
              variant='ghost'
              onClick={() => navigate('/upload')}>
              <ArrowUpCircle />
            </Button>
          </>
        ) : null}

        <Button variant='ghost'>
          <Menu />
        </Button>
      </div>
    </header>
  );
}

function NotificationsButton() {
  const { toggleShowNotificationsModal, hasUnseen } = useNotificationsContext();
  return (
    <Button
      variant='ghost'
      shape='circle'
      onClick={() => toggleShowNotificationsModal(true)}>
      <div className='relative'>
        <Bell />
        {hasUnseen ? (
          <div className='bg-red-500 w-2 h-2 rounded-full absolute z-10 right-0 bottom-1' />
        ) : null}
      </div>
    </Button>
  );
}
