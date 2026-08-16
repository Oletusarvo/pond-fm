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
import { ReactPromise } from 'react';
import { ToggleProvider, useToggleContext } from '../providers/toggle-provider';
import { Modal } from './modal';
import { NotificationsModal } from '../features/notifications/components/notifications-modal';
import { TrackModal } from '../features/posts/components/track-modal';
import { ProfileSettingsModal } from '../features/auth/components/settings-modal';

export function MainHeader() {
  const navigate = useNavigate();
  const authService = useAuthContext();
  const settingsService = useSettingsContext();
  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <div className='flex items-center gap-2 xs:text-xs md:text-base'>
        <Link to='/'>
          <h2 className='font-semibold cursive text-base'>
            🐸<span>Pond.fm</span>
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

      <div className='flex gap-4 items-center text-base'>
        {authService.status === 'authenticated' ? (
          <>
            {authService.session.user.subscription.label !== 'pro' ? <ToggleProvider>
              <ToggleProvider.Trigger>
                <Button variant="text" color="inherit">Go Pro</Button>
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <GetProModal />
              </ToggleProvider.Target>
            </ToggleProvider> : null}

            <Button
              variant='ghost'
              color="white"
              onClick={() => navigate(`/user/${authService.session.user.id}`)}>
              <UserIcon />
            </Button>
            <FeedProvider
              queryKey={['notifications']}
              queryFn={cursor => apiService.getNotifications(cursor)}
              refetchInterval={1000 * 60}>
              <NotificationsProvider>
                <ToggleProvider>
                  <ToggleProvider.Trigger>
                    <NotificationsButton />
                  </ToggleProvider.Trigger>
                  <ToggleProvider.Target>
                    <NotificationsModal />
                  </ToggleProvider.Target>
                </ToggleProvider>
              </NotificationsProvider>
            </FeedProvider>


            <ToggleProvider>
              <ToggleProvider.Trigger>
                <UploadButton />
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <TrackModal />
              </ToggleProvider.Target>
            </ToggleProvider>
            <ToggleProvider>
              <ToggleProvider.Trigger>
                <Button
                  color="white"
                  variant='ghost'
                >
                  <SettingsIcon />
                </Button>
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <ProfileSettingsModal />
              </ToggleProvider.Target>
            </ToggleProvider>

          </>
        ) : null}
      </div>
    </header>
  );
}

function GetProModal() {
  const { toggleState } = useToggleContext();
  return (
    <Modal title="Get Pro" onClose={() => toggleState(false)}>
      <h2 className="text-xl font-semibold">Increase your footprint with pro</h2>
      <p>Coming soon. With a pro-account, you will get 5gb of storage; plenty to get your tracks out there, for only €6,99 a month.</p>
    </Modal>
  );
}
function UploadButton(props) {
  return (
    <Button
      {...props}
      color="white"
      variant='ghost'>
      <UploadIcon />
    </Button>
  );
}

function NotificationsButton(props) {
  const { data } = useFeedContext();
  const hasUnseen = data?.some(item => item.seen_at == null);
  const authService = useAuthContext();

  return (
    <Button
      {...props}
      color="white"
      variant='ghost'
      shape='circle'
      onClick={async () => {
        await authService.refreshSession({
          user: {
            unseen_notification_count: 0
          }
        });
        props.onClick();
      }}>
      <div className='relative'>
        <NotificationsIcon />
        {hasUnseen ? (
          <div className='bg-red-500 p-1 aspect-square w-2 h-2 rounded-full absolute z-10 right-0 bottom-1 text-red text-center'></div>
        ) : null}
      </div>
    </Button>
  );
}

function NotificationsIcon() {
  return <HeaderIcon icon={Bell} />
}

function SettingsIcon() {
  return <HeaderIcon icon={Settings} />
}

function UserIcon() {
  return <HeaderIcon icon={User} />
}

function UploadIcon() {
  return <HeaderIcon icon={ArrowUpCircle} />
}

function HeaderIcon({ icon: Icon }: { icon: React.FC<any> }) {
  return (
    <Icon className="xs:w-5 md:w-8" />
  );
}
