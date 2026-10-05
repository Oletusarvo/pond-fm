import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/bottom-nav";
import { MainHeader } from "../components/main-header";
import { WindowResizeManager } from "../managers/window-resize-manager";
import { MiniPlayerWithInfo } from "../features/audio/components/mini-player-with-info";
import { AdProvider } from "../features/ads/providers/ad-provider";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { AdScript } from "../features/ads/components/ad-script";
import { CancelableTrackMethodsProvider } from "../providers/cancelable-function-provider";

/**Renders the layout of the entire app. */
export function MainLayout() {
  const { session } = useAuthContext();
  const areAdsEnabled = () => {
    if (!session) return true;
    const subscription = session.user.subscription;
    if (subscription.plan_id === "free" || ["unpaid", "incomplete"].includes(subscription.status))
      return true;

    return false;
  };

  const adsEnabled = areAdsEnabled();
  return (
    <div className='flex flex-col w-full h-full grow-0'>
      {adsEnabled ? <AdScript /> : null}
      <AdProvider interval={10} enabled={adsEnabled}>
        <MainHeader />
        <main className='flex flex-col flex-1 overflow-y-scroll'>
          <Outlet />
        </main>
        <CancelableTrackMethodsProvider>
          <MiniPlayerWithInfo />
        </CancelableTrackMethodsProvider>

        <BottomNav />
        <WindowResizeManager />
      </AdProvider>
    </div>
  );
}
