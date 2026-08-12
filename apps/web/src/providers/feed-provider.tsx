import { createProvider } from '../utils/create-provider';
import { useInfiniteFeed } from '../hooks/use-infinite-feed';

export const [FeedProvider, useFeedContext] = createProvider({
  contextName: 'FeedContext',
  hook: (props: Parameters<typeof useInfiniteFeed>[0]) => {
    const query = useInfiniteFeed(props);
    return query;
  },
});
