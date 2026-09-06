import { useInfiniteFeed } from "../../../hooks/use-infinite-feed";
import { api } from "../../../utils/api/api";

export function useNotifications(session?: any) {
  const query = useInfiniteFeed({
    queryKey: ["notifications"],
    queryFn: async (cursor) => {
      if (session) {
        const res = await api.users.notifications.get(cursor);
        return res.ok ? await res.json() : [];
      } else {
        return [];
      }
    },
    enabled: !!session,
  });

  return query;
}
