import { useAuthContext } from "../../auth/providers/auth-provider";
import { PollingModal } from "../../../components/polling-modal";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../../utils/api/api";

/**The screen shown after a user has successfully canceled their subscription.  */
export function SubscriptionCancelSuccess() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { session, refreshSession } = useAuthContext();
  const mode = search.get("mode") || "immediate";

  const verifyFn = (data) => {
    if (mode === "immediate") {
      return data.status === "active" && data.plan_id === "free";
    } else {
      return (data.cancel_at_period_end = true);
    }
  };

  const successMessage =
    mode === "immediate"
      ? "Your subscription has been canceled!"
      : "Your subscription has been set to automatically cancel at the current period end.";
  return (
    <PollingModal
      maxTries={10}
      pollingInterval={3000}
      pollingKey={["subscription", "cancel", "status", session?.user.id]}
      pollingFn={async () => await api.users.subscriptions.getStatus()}
      verifyData={verifyFn}
      onOk={() => navigate("/new")}
      onSuccess={async () => {
        const refreshOptions: Parameters<typeof refreshSession>[0] =
          mode === "at_period_end"
            ? {
                user: {
                  subscription: {
                    cancel_at_period_end: true,
                  },
                },
              }
            : {
                user: {
                  subscription: {
                    plan_id: "free",
                    status: "active",
                    storage_quota_bytes: 1024 ** 2 * 150,
                    cancel_at_period_end: null,
                  },
                },
              };

        await refreshSession(refreshOptions);
      }}
      title='Subscription Cancel Success'
      pendingMessage='Please wait while we verify your subscription cancelation...'
      successMessage={successMessage}
      errorMessage='Something went wrong!'
    />
  );
}
