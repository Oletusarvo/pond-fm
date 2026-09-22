import { PostProvider } from "../providers/post-provider";
import { Feed } from "../../../components/feed";
import { Post } from "./post";
import { PopulatePostStore } from "../providers/populates-post-store";
import { useAuthContext } from "../../auth/providers/auth-provider";

/**Renders feeds using the Post-component as the renderComponent. Each Post is wrapped inside a PostProvider.
 * This component must be placed within a FeedProvider, and will populate the post store with the fetched items. */
export function PostFeed() {
  return (
    <PopulatePostStore>
      <Feed
        keyExtractor={(item) => item?.id}
        renderComponent={({ item, ref }) => {
          if (!item) return null;
          return (
            <PostProvider trackId={item.track.id}>
              <Post ref={ref} />
            </PostProvider>
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
    </PopulatePostStore>
  );
}
