import { Separator } from "../../../components/separator";
import { PostFeed } from "../../posts/components/post-feed";

import { Spinner } from "../../../components/spinner";
import { UserProvider, useUserContext } from "../providers/user-proivder";
import { FeedProvider } from "../../../providers/feed-provider";
import { UserHeader } from "../components/user-header";
import { api } from "../../../utils/api/api";
import { TabsProvider, useTabsContext } from "../../../providers/tabs-provider";
import { useParams, useSearchParams } from "react-router-dom";
import { Heart, Music, Repeat } from "lucide-react";
import { useScrollToTop } from "../../../hooks/use-scroll-to-top";

export function UserScreenContent() {
  const userService = useUserContext();
  const [searchParams, setSearchParams] = useSearchParams();
  useScrollToTop();
  const initialTab = searchParams.get("tab");
  if (userService.isPending) {
    return <Spinner />;
  }

  return (
    <>
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
        <div className='sticky top-0 z-10 mb-4 mt-4 w-full rounded-full border border-slate-200 bg-slate-50/80 p-1 backdrop-blur-sm'>
          <div className='flex gap-1'>
            <TabButton index='tracks' icon={Music}>
              Tracks
            </TabButton>
            <TabButton index='reposts' icon={Repeat}>
              Reposts
            </TabButton>
            <TabButton index='likes' icon={Heart}>
              Likes
            </TabButton>
          </div>
        </div>

        <TabsProvider.Tab index={"tracks"}>
          <FeedProvider
            queryFn={(cursor) => api.tracks.feed.byAuthor(userService.user.id, cursor)}
            queryKey={["feed", "author", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
        <TabsProvider.Tab index={"reposts"}>
          <FeedProvider
            queryFn={(cursor) => api.tracks.feed.repostedBy(userService.user.id, cursor)}
            queryKey={["feed", "reposted", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
        <TabsProvider.Tab index={"likes"}>
          <FeedProvider
            queryFn={(cursor) => api.tracks.feed.likedBy(userService.user.id, cursor)}
            queryKey={["feed", "liked", userService.user.id]}
          >
            <PostFeed />
          </FeedProvider>
        </TabsProvider.Tab>
      </TabsProvider>
    </>
  );
}

function TabButton({
  children,
  index,
  icon: Icon,
}: React.PropsWithChildren & { index: string; icon: typeof Music }) {
  const { currentTab, updateCurrentTab } = useTabsContext();
  const isSelected = currentTab === index;

  return (
    <button
      type='button'
      onClick={() => updateCurrentTab(index)}
      className={[
        "flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition-all duration-150",
        isSelected
          ? "bg-slate-900 text-white shadow-sm shadow-slate-900/15"
          : "bg-transparent text-slate-600 hover:bg-white hover:text-slate-900",
      ].join(" ")}
    >
      <Icon size='0.9rem' />
      {children}
    </button>
  );
}

export function UserScreenWrapper() {
  const { id } = useParams();
  return (
    <UserProvider id={id}>
      <UserScreenContent />
    </UserProvider>
  );
}
