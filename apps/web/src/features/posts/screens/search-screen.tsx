import { Search } from "lucide-react";
import { PostFeedScreen } from "./feed-screen";
import { useState } from "react";
import { debounce } from "../../../utils/debounce";
import { api } from "../../../utils/api/api";
import { useInfiniteFeed } from "../../../hooks/use-infinite-feed";
import { PostFeedHeader } from "../components/post-feed-header";
import { PostFeed } from "../components/post-feed";
import { FeedProvider } from "../../../providers/feed-provider";
import { Input } from "../../../components/input";
import { PostFeedScreenContainer } from "../components/post-feed-screen-container";
import { Separator } from "../../../components/separator";
import { useSearchParams } from "react-router-dom";

/**Renders a screen allowing a user to search tracks by their title or author. */
export function SearchFeedScreen() {
  //const [search, setSearch] = useState<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q");
  const updateSearch = debounce(
    (value: string) => setSearchParams({ q: value }),
    700,
  );

  return (
    <PostFeedScreenContainer>
      <PostFeedHeader
        icon={<Search />}
        title='Search'
        description='Search for tracks by their title or author username'
      >
        <Input
          defaultValue={search}
          type='search'
          placeholder='Search by title or author username...'
          onChange={(e) => updateSearch(e.target.value)}
        />
      </PostFeedHeader>
      <Separator />
      <FeedProvider
        queryKey={["search", search]}
        queryFn={async (cursor) => api.tracks.feed.search(cursor, search)}
      >
        <PostFeed />
      </FeedProvider>
    </PostFeedScreenContainer>
  );
}
