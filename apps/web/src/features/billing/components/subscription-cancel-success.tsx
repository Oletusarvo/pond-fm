import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { PollingModal } from "../../../components/polling-modal";
import { useNavigate } from "react-router-dom";

export function SubscriptionCancelSuccess() {
  const navigate = useNavigate();
  const { session } = useAuthContext();

  return (
    <PollingModal
      maxTries={10}
      pollingInterval={3000}
      pollingKey={['subscription', 'cancel', 'status', session?.user.id]}
      pollingFn={async () => await apiService.getSubscriptionStatus()}
      verifyData={data => data.status === 'active' && data.plan_id === 'free'}
      onOk={() => navigate('/new')}
      title="Subscription Cancel Success"
      pendingMessage="Please wait while we verify your subscription cancelation..."
      successMessage="Your subscription has been canceled!"
      errorMessage="Something went wrong!" />
  );
}