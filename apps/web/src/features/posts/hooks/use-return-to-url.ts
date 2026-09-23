import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../auth/providers/auth-provider";

type UseAuthenticatedActionProps = {
  callbackUrl: string;
  returnUrl?: string;
  action: () => void | Promise<void>;
};

export function useAuthenticatedAction({
  callbackUrl,
  returnUrl,
  action,
}: UseAuthenticatedActionProps) {
  const { status } = useAuthContext();
  const navigate = useNavigate();

  const handler = async () => {
    if (status === "unauthenticated") {
      const searchParams = new URLSearchParams();
      if (callbackUrl) {
        searchParams.set("callback", callbackUrl);
      }
      if (returnUrl) {
        searchParams.set("return", returnUrl);
      }
      navigate(`/login?${searchParams.toString()}`);
    } else {
      await action();
    }
  };
  return handler;
}

export function useReturnToTrack({
  id,
  action,
}: { id: string } & Pick<UseAuthenticatedActionProps, "action">) {
  const location = useLocation();
  return useAuthenticatedAction({
    callbackUrl: `/track/${id}`,
    returnUrl: location.pathname,
    action,
  });
}
