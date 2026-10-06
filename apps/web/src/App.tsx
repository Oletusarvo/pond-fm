import { PlaybackProvider } from "./features/audio/providers/playback-provider";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { UndiscoveredFeedScreen } from "./features/posts/screens/undiscovered-feed-screen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginScreen } from "./features/auth/screens/login-screen";
import { MainLayout } from "./layouts/main-layout";
import { AuthProvider } from "./features/auth/providers/auth-provider";
import { HomeLayout } from "./layouts/home-layout";
import { AuthorizationScreen } from "./features/auth/screens/authorization-screen";
import { UploadTrackScreen } from "./features/posts/screens/upload-track-screen";
import { MainScreenFeed } from "./features/posts/screens/main-feed-screen";
import { UserScreen, UserScreenWrapper } from "./features/users/screens/user-screen";
import { ScrobbleProvider } from "./features/audio/providers/scrobble-provider";
import { SettingsProvider } from "./features/auth/providers/settings-provider";
import { ActionProvider } from "./providers/action-provider";
import { UserProvider } from "./features/users/providers/user-proivder";
import { FollowedFeedScreen } from "./features/posts/screens/followed-feed-screen";
import { TrackScreen } from "./features/posts/screens/track-screen";
import { BillingSuccessScreen } from "./features/billing/components/billing-success";
import { SubscriptionCancelSuccess } from "./features/billing/components/subscription-cancel-success";
import { SearchFeedScreen } from "./features/posts/screens/search-screen";
import { RegisterScreen } from "./features/auth/screens/signup-screen";
import { VerifyScreen } from "./features/auth/screens/verify-screen";
import { VerifyEmailUpdateScreen } from "./features/auth/screens/verify-email-update-screen";
import { AdProvider } from "./features/ads/providers/ad-provider";
import { HomeLayout2 } from "./layouts/home-layout-2";
import { Toaster } from "react-hot-toast";
import { CancelableTrackMethodsProvider } from "./providers/cancelable-function-provider";

function App() {
  return (
    <CancelableTrackMethodsProvider>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <AdProvider interval={2}>
            <PlaybackProvider>
              <div className='flex flex-col w-full h-full'>
                <BrowserRouter>
                  <Routes>
                    <Route path='/' element={<MainLayout />}>
                      <Route path='/billing/success' element={<BillingSuccessScreen />} />
                      <Route
                        path='/billing/cancel/success'
                        element={<SubscriptionCancelSuccess />}
                      />
                      <Route path='/' element={<HomeLayout />}>
                        <Route path='login' element={<LoginScreen />} />
                        <Route path='signup' element={<RegisterScreen />} />

                        <Route path='verify' element={<VerifyScreen />} />
                        <Route path='verify-email-update' element={<VerifyEmailUpdateScreen />} />
                      </Route>
                      <Route
                        path=''
                        element={
                          <div className='flex w-full flex-col h-pad'>
                            <Outlet />
                          </div>
                        }
                      >
                        <Route path='undiscovered' element={<UndiscoveredFeedScreen />} />
                        <Route path='new' element={<MainScreenFeed />} />
                        <Route path='followed' element={<FollowedFeedScreen />} />
                        <Route path='user/:id' element={<UserScreenWrapper />} />

                        <Route path='search' element={<SearchFeedScreen />} />

                        <Route path='upload' element={<UploadTrackScreen />} />
                        <Route path='login' element={<LoginScreen />} />

                        <Route path='track/:trackId' element={<TrackScreen />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </div>
            </PlaybackProvider>
          </AdProvider>
        </AuthProvider>
        <Toaster position='bottom-center' />
      </QueryClientProvider>
    </CancelableTrackMethodsProvider>
  );
}

export default App;
