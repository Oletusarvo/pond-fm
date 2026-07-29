import { PlaybackProvider } from './features/audio/providers/playback-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UndiscoveredFeedScreen } from './features/posts/screens/discovery-feed-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginScreen } from './features/auth/screens/login-screen';
import { MainLayout } from './layouts/main-layout';
import { AuthProvider } from './features/auth/providers/auth-provider';
import { HomeLayout } from './layouts/home-layout';
import { AuthorizationScreen } from './features/auth/screens/authorization-screen';
import { UploadTrackScreen } from './features/posts/screens/upload-track-screen';
import { AppProvider } from './providers/app-provider';
import { MainScreenFeed } from './features/posts/screens/main-feed-screen';
import { UserScreen } from './features/posts/screens/user-screen';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AppProvider>
        <AuthProvider>
          <PlaybackProvider>
            <div className='flex flex-col w-full h-full'>
              <BrowserRouter>
                <Routes>
                  <Route
                    path='/'
                    element={<MainLayout />}>
                    <Route
                      path='/'
                      element={<HomeLayout />}>
                      <Route
                        path='login'
                        element={<LoginScreen />}
                      />
                      <Route
                        path='authorize/:code'
                        element={<AuthorizationScreen />}
                      />
                    </Route>
                    <Route
                      path='undiscovered'
                      element={<UndiscoveredFeedScreen />}
                    />
                    <Route
                      path='user/:userDataBase64Url'
                      element={<UserScreen />}
                    />
                    <Route
                      path='new'
                      element={<MainScreenFeed />}
                    />
                    <Route
                      path='upload'
                      element={<UploadTrackScreen />}
                    />
                    <Route
                      path='login'
                      element={<LoginScreen />}
                    />
                  </Route>
                </Routes>
              </BrowserRouter>
            </div>
          </PlaybackProvider>
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
