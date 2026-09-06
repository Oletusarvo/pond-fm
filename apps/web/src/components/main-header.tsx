import { ArrowUpCircle, Bell, Settings, User } from "lucide-react";
import { Button } from "./button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { NotificationsProvider } from "../features/notifications/providers/notifications-provider";
import { ResponsiveLink } from "./responsive-link";
import { FeedProvider, useFeedContext } from "../providers/feed-provider";

import React from "react";
import { ToggleProvider } from "../providers/toggle-provider";
import { NotificationsModal } from "../features/notifications/components/notifications-modal";
import { UploadTrackModal } from "../features/posts/components/upload-track-modal";
import { GoProModal } from "../features/billing/components/go-pro-modal";
import { SettingsModal } from "../features/auth/components/settings-modal";
import { api } from "../utils/api/api";

export function MainHeader() {
  const { status: authStatus } = useAuthContext();

  return (
    <header className='bg-primary text-white py-2 h-pad w-full flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm'>
        <Link to='/'>
          <h2 className='font-semibold cursive'>
            🐸<span>Pond.fm</span>
          </h2>
        </Link>
        |{" "}
        <nav className='md:flex items-center gap-4 xs:hidden'>
          <ResponsiveLink to='/undiscovered' className='font-semibold'>
            Undiscovered
          </ResponsiveLink>
          <ResponsiveLink to='/new' className='font-semibold'>
            New
          </ResponsiveLink>
          {authStatus === "authenticated" ? (
            <ResponsiveLink to='/followed' className='font-semibold'>
              Followed
            </ResponsiveLink>
          ) : null}
        </nav>
      </div>

      <AuthControls authStatus={authStatus} />
    </header>
  );
}

/**
 * Renders the controls appearing when the user is logged in.
 * It is done in this ugly memo-way to stop the TrackModal from re-rendering when
 * the users session is updated after a track upload finishes.
 */
const AuthControls = React.memo(function ({
  authStatus,
}: {
  authStatus: ReturnType<typeof useAuthContext>["status"];
}) {
  return (
    <div className='flex gap-4 items-center text-sm'>
      {authStatus === "authenticated" ? (
        <>
          <GoProButton />
          <UserProfileButton />
          <FeedProvider
            queryKey={["notifications"]}
            queryFn={(cursor) => api.users.notifications.get(cursor)}
            refetchInterval={1000 * 60}
          >
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
              <UploadTrackModal />
            </ToggleProvider.Target>
          </ToggleProvider>
          <ToggleProvider>
            <ToggleProvider.Trigger>
              <Button color='white' variant='ghost' shape='circle'>
                <SettingsIcon />
              </Button>
            </ToggleProvider.Trigger>
            <ToggleProvider.Target>
              <SettingsModal />
            </ToggleProvider.Target>
          </ToggleProvider>
        </>
      ) : null}
    </div>
  );
});

function GoProButton() {
  const { session } = useAuthContext();
  return session.user.subscription.plan_id !== "pro" ? (
    <ToggleProvider>
      <ToggleProvider.Trigger>
        <Button variant='text' color='inherit'>
          Go Pro
        </Button>
      </ToggleProvider.Trigger>
      <ToggleProvider.Target>
        <GoProModal />
      </ToggleProvider.Target>
    </ToggleProvider>
  ) : null;
}

function UserProfileButton() {
  const { session } = useAuthContext();
  const navigate = useNavigate();
  return (
    <Button
      shape='circle'
      variant='ghost'
      color='white'
      onClick={() => navigate(`/user/${session.user.id}`)}
    >
      <UserIcon />
    </Button>
  );
}

function UploadButton(props) {
  return (
    <Button {...props} color='white' variant='ghost' shape='circle'>
      <UploadIcon />
    </Button>
  );
}

function NotificationsButton(props) {
  const { data } = useFeedContext();
  const hasUnseen = data?.some((item) => item.seen_at == null);
  const authService = useAuthContext();

  return (
    <Button
      {...props}
      color='white'
      variant='ghost'
      shape='circle'
      onClick={async () => {
        await authService.refreshSession({
          user: {
            unseen_notification_count: 0,
          },
        });
        props.onClick();
      }}
    >
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
  return <HeaderIcon icon={Bell} />;
}

function SettingsIcon() {
  return <HeaderIcon icon={Settings} />;
}

function UserIcon() {
  return <HeaderIcon icon={User} />;
}

function UploadIcon() {
  return <HeaderIcon icon={ArrowUpCircle} />;
}

function HeaderIcon({ icon: Icon }: { icon: React.FC<any> }) {
  return <Icon className='w-5' />;
}
