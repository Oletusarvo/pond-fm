import { useNavigate } from "react-router-dom";
import { useAction } from "../../../hooks/use-action";
import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../../auth/providers/auth-provider";

export function useCancelSubscription(props: Omit<Parameters<typeof useAction>[0], 'fn'> = {}) {
  const { refreshSession } = useAuthContext();
  const navigate = useNavigate();
  const { action: cancelSubscription, ...rest } = useAction({
    ...props,
    fn: async () => {
      const res = await apiService.cancelSubscription();
      if (res.ok) {
        await refreshSession({});
      }
      return res;
    },
    onSuccess: async (res) => {
      navigate('/billing/cancel/success');
      return await props.onSuccess?.(res);
    }
  });
  return { cancelSubscription, ...rest };
}