import { Outlet } from "react-router-dom";
import { BottomNav } from "../components/bottom-nav";
import { MainHeader } from "../components/main-header";
import { WindowResizeManager } from "../managers/window-resize-manager";
import { MiniPlayerWithInfo } from "../features/audio/components/mini-player-with-info";

/**Renders the layout of the entire app. */
export function MainLayout() {
  return (
    <div className='flex flex-col w-full h-full grow-0'>
      <MainHeader />
      <main className='flex flex-col w-full flex-1 overflow-y-scroll'>
        <Outlet />
      </main>
      <MiniPlayerWithInfo />
      <BottomNav />
      <WindowResizeManager />
    </div>
  );
}
