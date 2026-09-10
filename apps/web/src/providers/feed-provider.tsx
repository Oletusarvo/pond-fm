import { createProvider } from "../utils/create-provider";
import { useInfiniteFeed } from "../hooks/use-infinite-feed";

export const [
  /**Provides logic related to rendering of feeds. */
  FeedProvider,
  /**Accesses the properties of a FeedContext. */
  useFeedContext,
] = createProvider({
  contextName: "FeedContext",
  hook: (props: Parameters<typeof useInfiniteFeed>[0]) => {
    const query = useInfiniteFeed(props);
    return query;
  },
});
