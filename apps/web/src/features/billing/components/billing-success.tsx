import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useNavigate } from "react-router-dom";
import { PollingModal } from "../../../components/polling-modal";

export function BillingSuccessScreen() {
  const { session } = useAuthContext();
  const navigate = useNavigate();

  return (
    <PollingModal
      maxTries={10}
      pollingInterval={3000}
      title="Checkout Success"
      onOk={() => navigate('/new')}
      successMessage="You are now pro!"
      pendingMessage="Please wait while we process your subscription"
      errorMessage="Something went wrong!"
      pollingFn={async () => await apiService.getSubscriptionStatus()}
      pollingKey={['subscription', 'upgrade', 'status', session?.user.id]}
      verifyData={data => data.status === 'active' || data.plan_id === 'pro'}
    />
  );
}