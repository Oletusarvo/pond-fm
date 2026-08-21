import { Banknote, CardSim } from "lucide-react";
import { Spinner } from "../../../components/spinner";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "../../../components/modal";
import { apiService } from "../../../utils/api/api-service";
import { useAuthContext } from "../providers/auth-provider";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function BillingSuccessScreen() {
  const { session, refreshSession } = useAuthContext();
  const navigate = useNavigate();
  const enabledRef = useRef(true);
  const { data, isPending } = useQuery({
    queryKey: ['subscription', 'status', session?.user.id],
    queryFn: async () => {
      const res = await apiService.getSubscriptionStatus();
      return res.ok ? await res.json() : null;
    },
    refetchInterval: 1500,
    enabled: enabledRef.current,
  });


  useEffect(() => {
    if (data && !isPending) {
      if (data.status === 'active') {
        enabledRef.current = false;
        refreshSession({
          user: {
            subscription: {
              label: 'pro'
            }
          }
        })
          .then(() => {
            navigate('/new');
          });
      }
    }
  }, [data, isPending]);

  const message = isPending ? 'Subscription processing...' : 'Subscription updated!';
  const title = isPending ? 'Please wait while we process your subscription' : 'You are now pro!';
  return (
    <Modal title="Checkout success">
      <div className="flex flex-col w-full items-center">
        {
          data?.status !== 'active' ? (
            <>
              <Banknote size="2rem" />
              <span className="text-slate-500 text-sm cursive">{message}</span>
              <h2 className="font-semibold text-primary">{title}</h2>
              {isPending ? <Spinner /> : null}
            </>
          ) : null
        }
      </div>
    </Modal>
  );
}