import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from './use-infinite-feed';

export function useMainFeed(tag?: string) {
  const query = useInfiniteFeed({
    key: ['main', tag],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await apiService.getMainFeed(cursor, tag);
      return res.ok ? await res.json() : [];
    },
  });
  return query;
}
