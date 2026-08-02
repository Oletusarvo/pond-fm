import { apiService } from '../../../utils/api-service';
import { useInfiniteFeed } from './use-infinite-feed';

export function useSearchableFeed(currentSearch: string | null) {
  const query = useInfiniteFeed({
    key: ['search', currentSearch],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await apiService.getSearchableFeed(currentSearch, cursor);
      return res.ok ? await res.json() : null;
    },
  });
  return query;
}
