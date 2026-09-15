import { PostProvider } from "../providers/post-provider";
import { Feed } from "../../../components/feed";
import { Post } from "./post";
import { PopulatePostStore } from "../providers/populates-post-store";

/**Renders feeds using the Post-component as the renderComponent. Each Post is wrapped inside a PostProvider.
 * This component must be placed within a FeedProvider, and will populate the post store with the fetched items. */
export function PostFeed() {
  return (
    <PopulatePostStore>
      <Feed
        keyExtractor={(item) => item?.id}
        renderComponent={({ item }) => {
          if (!item) return null;
          return (
            <PostProvider trackId={item.track.id}>
              <Post />
            </PostProvider>
          );
        }}
      />
    </PopulatePostStore>
  );
}
