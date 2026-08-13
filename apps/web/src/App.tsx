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
import { UserScreen } from './features/users/screens/user-screen';
import { ScrobbleProvider } from './features/audio/providers/scrobble-provider';
import { PlayCountProvider } from './features/audio/providers/playcount-provider';
import { SettingsProvider } from './features/auth/providers/settings-provider';
import { ProfileSettingsModal } from './features/auth/components/settings-modal';
import { ActionProvider } from './providers/action-provider';
import { UserProvider } from './features/users/providers/user-proivder';
import { FollowedFeedScreen } from './features/posts/screens/followed-feed-screen';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <ActionProvider>
          <PlaybackProvider>
            <ScrobbleProvider>
              <div className='flex flex-col w-full h-full'>
                <BrowserRouter>
                  <SettingsProvider>
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
                        <Route path="followed" element={<FollowedFeedScreen />} />
                        <Route
                          path='user/:id'
                          element={<UserProvider><UserScreen /></UserProvider>}
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
                  </SettingsProvider>
                </BrowserRouter>
              </div>
            </ScrobbleProvider>

          </PlaybackProvider>
        </ActionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
