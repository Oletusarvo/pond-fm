import { useAuthContext } from "../features/auth/providers/auth-provider";
import { usePolling } from "../hooks/use-polling";
import { useStatus } from "../hooks/use-status";
import { LoaderButton } from "./button";
import { Modal } from "./modal";

type UsePollingParameters = Parameters<typeof usePolling>[0];
type PollingModalProps = {
  maxTries?: UsePollingParameters['maxTries'];
  pollingInterval?: UsePollingParameters['pollingInterval'];
  pollingKey: Parameters<typeof usePolling>[0]['queryKey'];
  pollingFn: () => Promise<Response>;
  verifyData: (data: any) => boolean;
  pendingMessage: string;
  errorMessage: string;
  successMessage: string;
  title: string;
  onOk: () => void;
};

export function PollingModal({ title, ...props }: PollingModalProps) {
  return (
    <Modal title={title}>
      <ModalContent {...props} />
    </Modal>
  );
}

function ModalContent({ maxTries, pollingInterval, pollingFn, verifyData, pollingKey, errorMessage, successMessage, pendingMessage, onOk }: Omit<PollingModalProps, 'title'>) {
  const { refreshSession } = useAuthContext();
  const { status: sessionRefreshStatus, setStatus } = useStatus('loading');
  const { isError, isPending } = usePolling({
    maxTries,
    pollingInterval,
    queryKey: pollingKey,
    queryFn: async () => await pollingFn(),
    onData: (data: any) => {
      const dataVerifyResult = verifyData(data);
      if (!dataVerifyResult) return true;
      refreshSession({})
        .then((res) => {
          if (!res.ok) {
            throw new Error("Something went wrong!");
          }
          else {
            setStatus('success');
          }
        })
        .catch(err => { console.log('Session refresh failed!', err.stack); setStatus('error') });
      return false;
    },
    onMaxTries: () => {
      setStatus('error');
    }
  });

  const message = isError || sessionRefreshStatus === 'error' ? errorMessage : sessionRefreshStatus === 'success' ? successMessage : pendingMessage;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col w-full items-center">
        <span className="text-slate-500 text-sm cursive">{message}</span>
      </div>
      <LoaderButton loading={sessionRefreshStatus === 'loading' || isPending} shape="rounded" disabled={sessionRefreshStatus !== 'success'} paddingEnabled fullWidth onClick={onOk}>Ok
      </LoaderButton>
    </div>
  )
}