import { Separator } from "../../../components/separator";
import { PostFeed } from "../../posts/components/post-feed";

import { Spinner } from "../../../components/spinner";
import { useUserContext } from "../providers/user-proivder";
import { FeedProvider } from "../../../providers/feed-provider";
import { UserHeader } from "../components/user-header";
import { api } from "../../../utils/api/api";

export function UserScreen() {
  const userService = useUserContext();
  if (userService.isPending) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col w-full max-h-full'>
      <UserHeader />
      <Separator />
      <FeedProvider
        queryFn={(cursor) =>
          api.tracks.feed.byAuthor(userService.user.id, cursor)
        }
        queryKey={["feed", "author", userService.user.id]}
      >
        <PostFeed />
      </FeedProvider>
    </div>
  );
}
