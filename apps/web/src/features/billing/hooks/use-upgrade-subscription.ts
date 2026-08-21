import { useAction } from "../../../hooks/use-action";
import { apiService } from "../../../utils/api/api-service";

export function useUpgradeSubscription(props: Parameters<typeof useAction>[0]) {
  const { action, status, loading } = useAction({
    ...props,
    fn: async (to: string) => {
      return await apiService.updateSubscription(to);
    }
  });
  return { upgradeSubscription: action, status, loading }
}