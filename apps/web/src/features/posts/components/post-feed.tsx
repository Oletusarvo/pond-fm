import { PostProvider } from "../providers/post-provider";
import { Feed } from "../../../components/feed";
import { Post } from "./post";
import { PopulatePostStore } from "../providers/populates-post-store";
import { useAuthContext } from "../../auth/providers/auth-provider";

/**Renders feeds using the Post-component as the renderComponent. Each Post is wrapped inside a PostProvider.
 * This component must be placed within a FeedProvider, and will populate the post store with the fetched items. */
export function PostFeed() {
  const { session } = useAuthContext();
  return (
    <PopulatePostStore>
      <Feed
        adsEnabled={() => {
          if (!session) return true;
          const subscription = session.user.subscription;
          if (
            subscription.plan_id === "free" ||
            ["unpaid", "incomplete"].includes(subscription.status)
          )
            return true;

          return false;
        }}
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
