import { ArrowUpCircle, Bell, Settings, User } from 'lucide-react';
import { Button } from './button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../features/auth/providers/auth-provider';
import {
  NotificationsProvider,
  useNotificationsContext,
} from '../features/notifications/providers/notifications-provider';
import { ResponsiveLink } from './responsive-link';
import { useSettingsContext } from '../features/auth/providers/settings-provider';
import { UploadProvider, useUploadContext } from '../features/posts/providers/upload-context';
import { FeedProvider, useFeedContext } from '../providers/feed-provider';
import { apiService } from '../utils/api-service';

export function MainHeader() {
  const navigate = useNavigate();
  const authService = useAuthContext();
  const settingsService = useSettingsContext();
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm'>
        <Link to='/'>
          <h2 className='font-semibold cursive text-lg'>
            🐸<span className='text-lg'>Pond.fm</span>
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
          {
            authService.status === 'authenticated' ? (
              <ResponsiveLink to="/followed" className="font-semibold">Followed</ResponsiveLink>
            ) : null
          }
        </nav>
      </div>

      <div className='flex gap-4 items-center'>
        {authService.status === 'authenticated' ? (
          <>
            <Button
              variant='ghost'
              color="white"
              onClick={() => navigate(`/user/${authService.session.user.id}`)}>
              <User />
            </Button>
            <FeedProvider
              queryKey={['notifications']}
              queryFn={cursor => apiService.getNotifications(cursor)}
              refetchInterval={1000 * 60}>
              <NotificationsProvider>
                <NotificationsButton />
              </NotificationsProvider>
            </FeedProvider>


            <UploadProvider>
              <UploadButton />
            </UploadProvider>

            <Button
              color="white"
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

function UploadButton() {
  const { toggleShowUploadModal } = useUploadContext();
  return (
    <Button
      color="white"
      variant='ghost'
      onClick={() => toggleShowUploadModal(true)}>
      <ArrowUpCircle />
    </Button>
  );
}

function NotificationsButton() {
  const { toggleShowNotificationsModal } = useNotificationsContext();
  const { data } = useFeedContext();
  const hasUnseen = data?.some(item => item.seen_at == null);
  const authService = useAuthContext();

  return (
    <Button
      color="white"
      variant='ghost'
      shape='circle'
      onClick={async () => {
        await authService.refreshSession({
          user: {
            unseen_notification_count: 0
          }
        }); toggleShowNotificationsModal(true)
      }}>
      <div className='relative'>
        <Bell />
        {hasUnseen ? (
          <div className='bg-red-500 p-1 aspect-square w-2 h-2 rounded-full absolute z-10 right-0 bottom-1 text-red text-center'></div>
        ) : null}
      </div>
    </Button>
  );
}
