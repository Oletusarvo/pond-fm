import { useAuthContext } from "../../auth/providers/auth-provider";
import { useNavigate } from "react-router-dom";
import { PollingModal } from "../../../components/polling-modal";
import { api } from "../../../utils/api/api";

/**The screen shown after a succesful subcription upgrade. Polls the server until a users subscription has been updated, then updates the local session.*/
export function BillingSuccessScreen() {
  const { session, refreshSession } = useAuthContext();
  const navigate = useNavigate();

  return (
    <PollingModal
      maxTries={10}
      pollingInterval={3000}
      title='Checkout Success'
      onOk={() => navigate("/new")}
      successMessage='You are now pro!'
      pendingMessage='Please wait while we process your subscription'
      errorMessage='Something went wrong!'
      pollingFn={async () => await api.users.subscriptions.getStatus()}
      pollingKey={["subscription", "upgrade", "status", session?.user.id]}
      verifyData={(data) => data.status === "active" || data.plan_id === "pro"}
      onSuccess={async () => {
        await refreshSession({
          user: {
            subscription: {
              plan_id: "pro",
              storage_quota_bytes: 1024 ** 3 * 5,
            },
          },
        });
      }}
    />
  );
}
