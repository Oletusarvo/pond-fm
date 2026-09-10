import { Separator } from "../../../components/separator";
import { PostFeed } from "../../posts/components/post-feed";

import { Spinner } from "../../../components/spinner";
import { useUserContext } from "../providers/user-proivder";
import { FeedProvider } from "../../../providers/feed-provider";
import { UserHeader } from "../components/user-header";
import { api } from "../../../utils/api/api";
import { TabsProvider } from "../../../providers/tabs-provider";
import { useSearchParams } from "react-router-dom";

export function UserScreen() {
  const userService = useUserContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");
  if (userService.isPending) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col w-full max-h-full'>
      <UserHeader />
      <Separator />
      <TabsProvider
        initialTab={initialTab}
        onChange={(tab) =>
          setSearchParams({
            tab: tab.toString(),
          })
        }
      >
        <div className='w-full flex h-pad'>
          <TabsProvider.Button index={"tracks"}>Tracks</TabsProvider.Button>
          <TabsProvider.Button index={"reposts"}>Reposts</TabsProvider.Button>
          <TabsProvider.Button index={"likes"}>Likes</TabsProvider.Button>
        </div>
        <TabsProvider.Tab index={"tracks"}>
          <FeedProvider
            queryFn={(cursor) =>
              api.tracks.feed.byAuthor(userService.user.id, cursor)
            }
            queryKey={["feed", "author", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
        <TabsProvider.Tab index={"reposts"}>
          <FeedProvider
            queryFn={(cursor) =>
              api.tracks.feed.repostedBy(userService.user.id, cursor)
            }
            queryKey={["feed", "reposted", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
        <TabsProvider.Tab index={"likes"}>
          <FeedProvider
            queryFn={(cursor) =>
              api.tracks.feed.likedBy(userService.user.id, cursor)
            }
            queryKey={["feed", "liked", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
      </TabsProvider>
    </div>
  );
}
