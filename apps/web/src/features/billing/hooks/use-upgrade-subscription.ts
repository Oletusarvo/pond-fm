import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";

export function useUpgradeSubscription(
  props: Omit<Parameters<typeof useAction>[0], "fn"> = {},
) {
  const { action: upgradeSubscription, ...rest } = useAction<{
    checkoutUrl: string;
  }>({
    ...props,
    fn: async () => {
      return await api.users.subscriptions.upgrade();
    },
  });
  return { upgradeSubscription, ...rest };
}
