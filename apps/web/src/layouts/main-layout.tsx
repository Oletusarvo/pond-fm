import { Outlet } from "react-router-dom";
import { AppBottomBar } from "../components/app-bottom-nav";
import { AppHeader } from "../components/app-header";
import { WindowResizeManager } from "../managers/window-resize-manager";
import { MiniPlayerWithInfo } from "../features/audio/components/mini-player-with-info";
import { AdProvider } from "../features/ads/providers/ad-provider";
import { useAuthContext } from "../features/auth/providers/auth-provider";
import { AdScript } from "../features/ads/components/ad-script";
import { CancelableTrackMethodsProvider } from "../providers/cancelable-function-provider";
import { useScrollToTop } from "../hooks/use-scroll-to-top";
import { createProvider } from "../utils/create-provider";
import { useRef } from "react";

export const [MainLayoutProvider, useMainLayoutContext] = createProvider({
  contextName: "MainLayoutContext",
  hook: ({ refElement }: { refElement: HTMLDivElement }) => {
    return { refElement };
  },
});
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
  const ref = useRef(null);
  const adsEnabled = areAdsEnabled();
  return (
    <>
      {adsEnabled ? <AdScript /> : null}
      <AdProvider interval={10} enabled={adsEnabled}>
        <AppHeader />
        <MainLayoutProvider refElement={ref.current}>
          <main className='flex flex-col flex-1 overflow-y-scroll' ref={ref}>
            <Outlet />
          </main>
        </MainLayoutProvider>

        <CancelableTrackMethodsProvider>
          <MiniPlayerWithInfo />
        </CancelableTrackMethodsProvider>

        <AppBottomBar />
        <WindowResizeManager />
      </AdProvider>
    </>
  );
}
