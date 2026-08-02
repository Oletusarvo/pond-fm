import { useInfiniteQuery } from '@tanstack/react-query';
import { createProvider } from '../utils/create-provider';
import { useInfiniteFeed } from '../features/posts/hooks/use-infinite-feed';

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
      key: queryKey,
      queryFn: async ({ pageParam }) => {
        const res = await queryFn(pageParam);
        return res.ok ? await res.json() : [];
      },
    });
    return query;
  },
});
