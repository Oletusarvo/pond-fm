import { TrackProvider } from "../providers/post-provider";
import { Feed } from "../../../components/feed";
import { Post } from "./post";
import { PopulateTrackStore } from "../providers/populates-post-store";
import { AdProvider } from "../../ads/providers/ad-provider";
import { Ad } from "../../ads/components/ad-container";
import { CancelableTrackMethodsProvider } from "../../../providers/cancelable-track-methods-provider";
import { TrackActionProvider } from "../providers/track-action-provider";
import { usePlaylistStore } from "../../audio/hooks/use-playlist-store";
import { usePopulateTrackFeed } from "../hooks/use-populate-track-store";
import { usePopulatePlaylistStore } from "../../audio/hooks/use-populate-playlist-store";
import { PopulatesPlaylistStore } from "../providers/populates-playlist-store";

const adElement = import.meta.env.PROD ? <Ad /> : null;

/**Renders feeds using the Post-component as the renderComponent. Each Post is wrapped inside a PostProvider.
 * This component must be placed within a FeedProvider, and will populate the post store with the fetched items. */
export function PostFeed() {
  return (
    <>
      <PopulateTrackStore />
      <PopulatesPlaylistStore />
      <Feed
        keyExtractor={(item) => item?.id}
        renderComponent={({ item }) => {
          if (!item) return null;
          return (
            <CancelableTrackMethodsProvider>
              <TrackProvider trackId={item.id}>
                <AdProvider.Injector adElement={adElement}>
                  <Post />
                </AdProvider.Injector>
              </TrackProvider>
            </CancelableTrackMethodsProvider>
          );
        }}
        onEmptyComponent={() => {
          return (
            <div className='flex flex-col w-full flex-1 items-center justify-center'>
              <h3 className='text-xl font-bold text-primary'>No tracks found.</h3>
            </div>
          );
        }}
      />
    </>
  );
}
