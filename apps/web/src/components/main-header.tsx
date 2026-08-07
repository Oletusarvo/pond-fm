import { ArrowUpCircle, Bell, Menu, Settings, User } from 'lucide-react';
import { Button } from './button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/providers/auth-provider';
import {
  NotificationsProvider,
  useNotificationsContext,
} from '../features/notifications/providers/notifications-provider';
import { ResponsiveLink } from './responsive-link';
import { FeedProvider } from '../providers/feed-provider';
import { useNotifications } from '../features/notifications/hooks/use-notifications';
import { apiService } from '../utils/api-service';
import { useSettingsContext } from '../features/auth/providers/settings-provider';

export function MainHeader() {
  const navigate = useNavigate();
  const authService = useAuthContext();
  const settingsService = useSettingsContext();
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm'>
        <Link to='/'>
          <h2 className='font-semibold cursive text-lg'>
            🐸<span className='text-lg'>Pond Fm</span>
          </h2>
        </Link>
        |{' '}
        <nav className='md:flex items-center gap-4 xs:hidden'>
          <ResponsiveLink
            to='/undiscovered'
            className='font-semibold'>
            Undiscovered
          </ResponsiveLink>
          <ResponsiveLink
            to='/new'
            className='font-semibold'>
            New
          </ResponsiveLink>
        </nav>
      </div>

      <div className='flex gap-4 items-center'>
        {authService.status === 'authenticated' ? (
          <>
            <Button
              variant='ghost'
              onClick={() => navigate(`/user/${authService.session.user.id}`)}>
              <User />
            </Button>

            <NotificationsProvider>
              <NotificationsButton />
            </NotificationsProvider>

            <Button
              variant='ghost'
              onClick={() => navigate('/upload')}>
              <ArrowUpCircle />
            </Button>

            <Button
              variant='ghost'
              onClick={() => settingsService.toggleSettingsModal(true)}>
              <Settings />
            </Button>
          </>
        ) : null}
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
          <div className='bg-red-500 p-1 aspect-square w-2 h-2 rounded-full absolute z-10 right-0 bottom-1 text-red text-center'></div>
        ) : null}
      </div>
    </Button>
  );
}
