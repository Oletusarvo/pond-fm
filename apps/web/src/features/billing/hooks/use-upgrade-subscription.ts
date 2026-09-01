import { useAction } from "../../../hooks/use-action";
import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../../auth/providers/auth-provider";

export function useUpgradeSubscription(props: Omit<Parameters<typeof useAction>[0], 'fn'> = {}) {
  const { refreshSession } = useAuthContext();
  const { action: upgradeSubscription, ...rest } = useAction({
    ...props,
    fn: async () => {
      const res = await apiService.upgradeSubscription();
      if (res.ok) {
        await refreshSession({});
      }
      return res;
    },
  });
  return { upgradeSubscription, ...rest };
}