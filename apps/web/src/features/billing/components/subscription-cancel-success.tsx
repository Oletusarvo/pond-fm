import { useAuthContext } from "../../auth/providers/auth-provider";
import { PollingModal } from "../../../components/polling-modal";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api/api";

/**The screen shown after a user has successfully canceled their subscription.  */
export function SubscriptionCancelSuccess() {
  const navigate = useNavigate();
  const { session, refreshSession } = useAuthContext();

  return (
    <PollingModal
      maxTries={10}
      pollingInterval={3000}
      pollingKey={["subscription", "cancel", "status", session?.user.id]}
      pollingFn={async () => await api.users.subscriptions.getStatus()}
      verifyData={(data) => data.status === "active" && data.plan_id === "free"}
      onOk={() => navigate("/new")}
      onSuccess={async () => {
        await refreshSession({
          user: {
            subscription: {
              plan_id: "free",
              status: "active",
              storage_quota_bytes: 1024 ** 2 * 150,
            },
          },
        });
      }}
      title='Subscription Cancel Success'
      pendingMessage='Please wait while we verify your subscription cancelation...'
      successMessage='Your subscription has been canceled!'
      errorMessage='Something went wrong!'
    />
  );
}
