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
import { ScrobbleProvider } from './features/audio/providers/scrobble-provider';
import { PlayCountProvider } from './features/audio/providers/playcount-provider';
import { SearchScreen } from './features/posts/screens/search-screen';
import { SettingsProvider } from './features/auth/providers/settings-provider';
import { ProfileSettingsModal } from './features/auth/components/settings-modal';
import { EventsProvider } from './providers/events-provider';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <PlaybackProvider>
          <EventsProvider>
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
                        <Route
                          path='user/:id'
                          element={<UserScreen />}
                        />
                        <Route
                          path='new'
                          element={<MainScreenFeed />}
                        />
                        <Route
                          path='search'
                          element={<SearchScreen />}
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
          </EventsProvider>
        </PlaybackProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
