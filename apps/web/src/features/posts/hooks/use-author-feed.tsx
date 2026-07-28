import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from './use-infinite-feed';

export function useAuthorFeed(authorId: string) {
  const query = useInfiniteFeed({
    key: ['author', 'feed', authorId],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await apiService.getAuthorFeed(authorId, cursor);
      return res.ok ? await res.json() : [];
    },
  });
  return query;
}
