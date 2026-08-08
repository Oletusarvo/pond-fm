import { Modal } from '../../../components/modal';
import { Button, LoaderButton } from '../../../components/button';
import { useStatus } from '../../../hooks/use-status';
import { ErrorMessage } from '../../../components/helper-message';
import { useAuthContext } from '../providers/auth-provider';

export function LogoutModal() {
  const authService = useAuthContext();
  const cancel = () => authService.toggleLogoutModal(false);

  return (
    <Modal
      title='Logout'
      onClose={cancel}>
      <ModalContent cancel={cancel} />
    </Modal>
  );
}

function ModalContent({ cancel }) {
  const authService = useAuthContext();
  const { status, loading, setStatus } = useStatus();
  const buttonsDisabled = loading || status === 'success';

  const onLogout = async () => {
    try {
      const res = await authService.logout();
      if (!res.ok) {
        setStatus('error');
      } else {
        setStatus('success');
        cancel();
      }
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    }
  };

  return (
    <div className='flex flex-col gap-8 w-full'>
      <p>You are about to log out. Are you sure?</p>
      <div className='flex w-full gap-2'>
        <Button
          fullWidth
          shape='rounded'
          onClick={cancel}
          variant='outlined'
          paddingEnabled
          disabled={buttonsDisabled}>
          Cancel
        </Button>
        <LoaderButton
          loading={loading}
          fullWidth
          shape='rounded'
          onClick={onLogout}
          variant='contained'
          paddingEnabled
          disabled={buttonsDisabled}>
          Logout
        </LoaderButton>
      </div>
      {status === 'error' ? <ErrorMessage>Logout failed! Please try again.</ErrorMessage> : null}
    </div>
  )
}
