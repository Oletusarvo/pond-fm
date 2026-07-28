import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from './use-infinite-feed';

export function useDiscoveryFeed(tag?: string) {
  const query = useInfiniteFeed({
    key: ['discovery', tag],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await apiService.getDiscoveryFeed(cursor, tag);
      return res.ok ? await res.json() : [];
    },
  });

  return query;
}
