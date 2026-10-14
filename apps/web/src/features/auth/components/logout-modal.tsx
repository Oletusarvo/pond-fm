import { Modal } from "../../../components/modal";
import { useStatus } from "../../../hooks/use-status";
import { useAuthContext } from "../providers/auth-provider";
import { LogOut } from "lucide-react";
import { Spinner } from "../../../components/spinner";

export function LogoutModal() {
  const authService = useAuthContext();
  const cancel = () => authService.toggleLogoutModal(false);

  return (
    <Modal title='Logout' onClose={cancel}>
      <ModalContent cancel={cancel} />
    </Modal>
  );
}

function ModalContent({ cancel }) {
  const authService = useAuthContext();
  const { status, loading, setStatus } = useStatus();
  const buttonsDisabled = loading || status === "success";

  const onLogout = async () => {
    setStatus("loading");
    try {
      const res = await authService.logout();
      if (!res.success) {
        setStatus("error");
      } else {
        setStatus("success");
        cancel();
      }
    } catch (err) {
      console.log(err.message);
      setStatus("error");
    }
  };

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex w-full justify-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700'>
          <LogOut className='h-8 w-8' />
        </div>
      </div>
      <div className='mx-auto max-w-xl text-center'>
        <h2 className='text-xl font-bold text-slate-900'>Log out of Amphitune?</h2>
        <p className='mt-2 text-sm leading-6 text-slate-600'>
          You can sign back in with Audius whenever you’re ready.
        </p>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <button
          type='button'
          onClick={onLogout}
          disabled={buttonsDisabled}
          className='button --primary'
        >
          {loading ? <Spinner /> : <LogOut className='h-4 w-4' />}
          {loading ? "Logging out..." : "Log out"}
        </button>
        <button
          type='button'
          onClick={cancel}
          disabled={buttonsDisabled}
          className='button --secondary'
        >
          Cancel
        </button>
      </div>
      {status === "error" ? (
        <p
          role='alert'
          className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
        >
          Logout failed. Please try again.
        </p>
      ) : null}
    </div>
  );
}
