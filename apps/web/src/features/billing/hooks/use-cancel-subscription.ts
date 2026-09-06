import { useNavigate } from "react-router-dom";
import { useAction } from "../../../hooks/use-action";
import { api } from "../../../utils/api/api";
import { extractJsonBody } from "../../../utils/extract-json-body";

export function useCancelSubscription(
  props: Omit<Parameters<typeof useAction>[0], "fn"> = {},
) {
  const navigate = useNavigate();
  const { action: cancelSubscription, ...rest } = useAction<null>({
    ...props,
    fn: async () => {
      return await api.users.subscriptions.cancel();
    },
    onSuccess: async (res) => {
      navigate("/billing/cancel/success");
      return await props.onSuccess?.(res);
    },
  });
  return { cancelSubscription, ...rest };
}
