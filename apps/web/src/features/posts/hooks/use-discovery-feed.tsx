import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from './use-infinite-feed';

export function useDiscoveryFeed() {
  const query = useInfiniteFeed({
    key: ['discovery'],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await apiService.getDiscoveryFeed(cursor);
      return res.ok ? await res.json() : [];
    },
  });

  return query;
}
