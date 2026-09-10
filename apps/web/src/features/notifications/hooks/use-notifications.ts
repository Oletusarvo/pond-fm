import { useInfiniteFeed } from "../../../hooks/use-infinite-feed";
import { api } from "../../../utils/api/api";

export function useNotifications(session?: any) {
  const query = useInfiniteFeed({
    queryKey: ["notifications"],
    queryFn: async (cursor) => {
      return await api.users.notifications.get(cursor);
    },
    enabled: !!session,
  });

  return query;
}
