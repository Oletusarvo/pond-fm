import { createProvider } from '../utils/create-provider';
import { useInfiniteFeed } from '../hooks/use-infinite-feed';

export const [FeedProvider, useFeedContext] = createProvider({
  contextName: 'FeedContext',
  hook: ({
    queryFn,
    queryKey,
  }: {
    queryFn: (cursor?: string) => Promise<any>;
    queryKey: string[];
  }) => {
    const query = useInfiniteFeed({
      queryKey,
      queryFn,
    });
    return query;
  },
});
