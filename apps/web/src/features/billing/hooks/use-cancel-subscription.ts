import { useNavigate } from "react-router-dom";
import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";

type UseCancelSubscriptionProps = Omit<Parameters<typeof useAction>[0], "fn"> & {
  mode?: "at_period_end" | "immediate";
};

export function useCancelSubscription({
  mode = "immediate",
  ...props
}: UseCancelSubscriptionProps) {
  const navigate = useNavigate();
  const { action: cancelSubscription, ...rest } = useAction<null>({
    ...props,
    fn: async () => {
      return await api.users.subscriptions.cancel();
    },
    onSuccess: async (res) => {
      navigate(`/billing/cancel/success?mode=${mode}`);
      return await props.onSuccess?.(res);
    },
  });
  return { cancelSubscription, ...rest };
}
