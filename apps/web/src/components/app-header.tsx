import { ArrowDownCircle, ArrowUpCircle, Bell, Settings, User } from "lucide-react";
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
import { defaults } from "../utils/defaults";
import { ImportTracksModal } from "../features/posts/components/import-tracks-modal";
import { AppIcon } from "./app-icon";

/**Renders the main app header.*/
export function AppHeader() {
  const { status: authStatus } = useAuthContext();

  return (
    <header className='flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 py-2 text-slate-900 shadow-[0_4px_18px_rgba(15,23,42,0.04)] backdrop-blur-sm h-pad'>
      <div className='flex min-w-0 items-center gap-4 text-sm'>
        <Link
          to='/'
          className='flex shrink-0 items-center gap-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600'
        >
          <AppIcon />
          <h2 className='font-bold text-slate-900 cursive'>
            <span>Amphitune</span>
          </h2>
        </Link>

        <nav aria-label='Primary navigation' className='hidden items-center gap-1 md:flex'>
          <ResponsiveLink
            to='/undiscovered'
            className='rounded-lg px-3 py-2 font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800'
          >
            Undiscovered
          </ResponsiveLink>
          <ResponsiveLink
            to='/new'
            className='rounded-lg px-3 py-2 font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800'
          >
            New
          </ResponsiveLink>

          {authStatus === "authenticated" ? (
            <ResponsiveLink
              to='/followed'
              className='rounded-lg px-3 py-2 font-semibold text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-800'
            >
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
    <div className='flex shrink-0 items-center gap-1 sm:gap-2'>
      {authStatus === "authenticated" ? (
        <>
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
              <ImportTracksModal />
            </ToggleProvider.Target>
          </ToggleProvider>
          <ToggleProvider>
            <ToggleProvider.Trigger>
              <Button
                color='primary'
                variant='ghost'
                shape='circle'
                paddingEnabled
                aria-label='Open settings'
                title='Settings'
              >
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
  return session?.user.subscription.plan_id !== "pro" ? (
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
      color='primary'
      paddingEnabled
      aria-label='Open profile'
      title='Profile'
      onClick={() => navigate(defaults.url.userTracks(session.user.id))}
    >
      <UserIcon />
    </Button>
  );
}

function UploadButton(props) {
  return (
    <Button
      {...props}
      color='primary'
      variant='ghost'
      shape='circle'
      paddingEnabled
      aria-label='Import or upload tracks'
      title='Import or upload tracks'
    >
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
      color='primary'
      variant='ghost'
      shape='circle'
      paddingEnabled
      aria-label='Notifications'
      title='Notifications'
      onClick={async (e) => {
        await authService.refreshSession({
          user: {
            unseen_notification_count: 0,
          },
        });
        props.onClick(e);
      }}
    >
      <div className='relative'>
        <NotificationsIcon />
        {hasUnseen ? (
          <>
            <div className='absolute bottom-1 right-0 z-10 h-2 w-2 animate-ping rounded-full bg-red-500 ring-2 ring-white'></div>

            <div className='absolute bottom-1 right-0 z-10 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white'></div>
          </>
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
