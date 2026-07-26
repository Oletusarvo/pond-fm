import { Outlet } from 'react-router-dom';
import { BottomNav } from '../components/bottom-nav';
import { MainHeader } from '../components/main-header';
import { MiniPlayer } from '../features/posts/components/mini-player';
import { WindowResizeManager } from '../managers/window-resize-manager';

export function MainLayout() {
  return (
    <div className='flex flex-col w-full h-full grow-0'>
      <MainHeader />
      <main className='flex flex-col w-full flex-1 overflow-y-scroll'>
        <Outlet />
      </main>
      <MiniPlayer />
      <BottomNav />
      <WindowResizeManager />
    </div>
  );
}
