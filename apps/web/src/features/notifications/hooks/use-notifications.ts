import { useAppContext } from '../../../providers/app-provider';
import { apiService } from '../../../utils/api/api-service';
import { useInfiniteFeed } from '../../../hooks/use-infinite-feed';

export function useNotifications(session?: any) {
  const query = useInfiniteFeed({
    queryKey: ['notifications'],
    queryFn: async (cursor) => {
      if (session) {
        const res = await apiService.getNotifications(cursor);
        return res.ok ? await res.json() : [];
      } else {
        return [];
      }
    },
    enabled: !!session,
  });

  return query;
}
